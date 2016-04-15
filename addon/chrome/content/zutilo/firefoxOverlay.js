/* Copyright 2012 Will Shanks.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';
/* global gBrowser, window, document, Components, Services */
/* global Zotero, Zotero_Browser, ZoteroPane */
/* global Zutilo, ZutiloChrome */
Components.utils.import('resource://gre/modules/Services.jsm');
/******************************************/
// Include core modules
/******************************************/
Components.utils.import('chrome://zutilo/content/zutilo.jsm');

/******************************************/
// Firefox overlay
/******************************************/
ZutiloChrome.firefoxOverlay = {
    warnedThisSession: false,
    cleanupQueue: [],
    isScraping: false,
    scrapeTimeout: null,

    init: function() {
        window.setTimeout(function() {
            if (typeof ZutiloChrome != 'undefined') {
                Zutilo.checkZoteroActiveAndCallIf(false,
                                                  ZutiloChrome.firefoxOverlay,
                               ZutiloChrome.firefoxOverlay.warnZoteroNotActive);
                var overlayFunc = function() {this.firefoxZoteroOverlay()}
                Zutilo.checkZoteroActiveAndCallIf(true,
                                                  ZutiloChrome.firefoxOverlay,
                                                  overlayFunc);
            }
        }, 500);
    },

    unload: function() {
        for (var index = 0; index < this.cleanupQueue.length; index++) {
            this.cleanupQueue[index]();
        }
    },

    warnZoteroNotActive: function() {
        var showWarn = Zutilo.Prefs.get('warnZoteroNotActive');

        if (showWarn && !this.warnedThisSession) {
            window.openDialog('chrome://zutilo/content/zoteroNotActive.xul',
                'zutilo-zoteroNotActive-window', 'chrome,centerscreen');
            this.warnedThisSession = true;
        }
    },

    /**************************************************************************/
    // Load Firefox-specific overlay that is relevant only when Zotero is active
    /**************************************************************************/
    firefoxZoteroOverlay: function() {
        this.refreshContentAreaContextMenu = refreshContentAreaContextMenu;
        this.scrapeThisPage = scrapeThisPage

        setupContentAreaContextMenu()
        setupStatusPopup()
    },

    /**************************************************************************/
    // Attach link functions
    /**************************************************************************/

    /* Attach the file located at url to the currently selected item in Zotero.

        url: string with url to attach
        processType: string mode to use for processing the attachment.  If
            unspecified, determine from Zutilo preferences and mimeType
            Possible values....
            Zotero: use Zotero's default import and filenaming.
            prompt: prompt the user for a file location, import attach with
                Zotero, and then move the attachment to the file location and
                change to linked file attachment
            ZotFile: import using Zotero and then pass the attachment to
                ZotFile.renameAttachment()
    */
    attachURLToCurrentItem: function(url, processType) {
        // Error check item selection and get Zotero item
        var zitems = ZutiloChrome.zoteroOverlay.getSelectedItems('regular');
        if (!ZutiloChrome.zoteroOverlay.checkItemNumber(zitems,
                                                        'regularSingle')) {
            return
        }
        var zitem = zitems[0];

        this.attachURLToItem(zitem, url, processType);
    },

    attachURLToItem: function(zitem, url, processType) {
        var allowedProcesses = ['prompt', 'Zotero', 'promptAfterOne'];
        if (allowedProcesses.indexOf(processType) == -1) {
            processType = Zutilo.Prefs.get('attachmentImportProcessType');
        }

        // Prompt if there is an existing non-snapshot attachment
        if (processType == 'promptAfterOne') {
            var attachments = Zotero.Items.get(zitem.getAttachments(false));
            var existingAttachments = false;
            // Check for existing non-snapshot attachments
            for (var index = 0; index < attachments.length; index++) {
                if (!(attachments[index].attachmentLinkMode ==
                    Zotero.Attachments.LINK_MODE_IMPORTED_URL &&
                    attachments[index].attachmentMIMEType !=
                        'application/pdf')) {
                    existingAttachments = true;
                    break
                }
            }
            if (existingAttachments) {
                processType = 'prompt';
            } else {
                processType = 'Zotero';
            }
        }

        function mimeCallback(mimeType, hasNativeHandler) {
            function zoteroImport(attachmentCallback) {
                if (Zutilo.zoteroVersion.split('.')[0] < 5) {
                    // XXX: Legacy 4.0
                    Zotero.Attachments.importFromURL(url, zitem.id, undefined,
                                                     undefined,
                                                     undefined, mimeType,
                                                     undefined,
                                                     attachmentCallback)
                } else {
                    Zotero.Promise.coroutine(function*() {
                        let attachmentItem =
                            yield Zotero.Attachments.importFromURL(
                                {url: url,
                                 parentItemID: zitem.id,
                                 contentType: mimeType})
                        if (attachmentCallback !== null) {
                            attachmentCallback(attachmentItem)
                        }
                    })()
                }
            }

            function moveAttachment(attachmentItem) {
                var nsIFilePicker = Components.interfaces.nsIFilePicker;
                var fp = Components.classes['@mozilla.org/filepicker;1']
                    .createInstance(nsIFilePicker);
                var strName = 'zutilo.attachments.selectDestination';
                fp.init(window,
                    Zutilo._bundle.GetStringFromName(strName),
                    nsIFilePicker.modeSave);
                fp.appendFilters(nsIFilePicker.filterAll);

                var importedFile = attachmentItem.getFile();
                fp.defaultString = ZutiloChrome.firefoxOverlay.
                    adjustZoteroExtension(url, importedFile.leafName)

                fp.open(function(result) {
                    if (result == nsIFilePicker.returnOK ||
                        result == nsIFilePicker.returnReplace) {
                        // Move attachment file to chosen directory and
                        // attach as linked file.
                        importedFile.moveTo(fp.file.parent,
                                            fp.file.leafName);
                        if (Zutilo.zoteroVersion.split('.')[0] < 5) {
                            // XXX: Legacy 4.0
                            Zotero.Attachments.linkFromFile(fp.file,
                                                            zitem.itemID)
                        } else {
                            Zotero.Attachments.
                                linkFromFile({file: fp.file,
                                              parentItemID: zitem.itemID})
                        }
                    }
                    if (Zutilo.zoteroVersion.split('.')[0] < 5) {
                        // XXX: Legacy 4.0
                        attachmentItem.erase()
                    } else {
                        attachmentItem.eraseTx()
                    }
                })
            }

            // Choose process type for mimeType
            if (processType == 'prompt') {
                // Prompt for file name and location
                zoteroImport(moveAttachment)
            } else if (processType == 'Zotero') {
                // Use Zotero importFromURL()
                zoteroImport(function() {});
            }
        }

        if (Zutilo.zoteroVersion.split('.')[0] < 5) {
            // XXX: Legacy 4.0
            Zotero.MIME.getMIMETypeFromURL(url, mimeCallback)
        } else {
            Zotero.MIME.getMIMETypeFromURL(url).then(function(result) {
                mimeCallback(result[0], result[1])
            })
        }
    },

    adjustZoteroExtension: function(url, zoteroFileName) {
        /* Zotero compresses file extensions based on MIME type (e.g. all
        text files get converted to '.txt'.  Here we try to put back the
        original extension if it can be guessed from the URL.  We have to be
        conservative though because sometimes URL's are misleading (e.g. pdf's
        on arxiv.org whose urls don't include the 'pdf' part) and Zotero gets
        them right by looking at the MIME type. */
        var extensionPosition = url.lastIndexOf('.');
        var urlExtension =
            extensionPosition == -1 ? '' : url.substr(extensionPosition + 1);
        if (urlExtension.length == 3 || urlExtension.length == 4) {
            var re = new RegExp('[a-z]', 'i');
            if (re.test(urlExtension[0])) {
                zoteroFileName = zoteroFileName.substr(0,
                    zoteroFileName.lastIndexOf('.')) + '.' + urlExtension;
            }
        }

        return zoteroFileName
    }
};

/************************************************************************/
// Firefox contentAreaContextMenu
/************************************************************************/

function setupContentAreaContextMenu() {
    var FFContAreaContMenu = document.
        getElementById('contentAreaContextMenu');
    var ZoteroSubmenu = document.
        getElementById('zotero-content-area-context-menu');

    appendCACMCommandItems(FFContAreaContMenu, 'zutilo-ffcacm-',
        ZoteroSubmenu.nextSibling);

    var ZoteroSubmenuPopup = document.
        getElementById('zotero-context-item-from-page').parentElement;
    var ZoteroSubmenuSeparator = document.createElement('menuseparator');
    var ZoteroSubmenuSeparatorID = 'zutilo-ffcacm-zoterosubmenu-separator';
    ZoteroSubmenuSeparator.
        setAttribute('id', 'zutilo-ffcacm-zoterosubmenu-separator');
    ZoteroSubmenuPopup.appendChild(ZoteroSubmenuSeparator);
    ZutiloChrome.XULRootElements.push(ZoteroSubmenuSeparatorID);
    appendCACMCommandItems(ZoteroSubmenuPopup,
                           'zutilo-ffcacm-zoterosubmenu-');

    FFContAreaContMenu.addEventListener('popupshowing',
        ZutiloChrome.firefoxOverlay.refreshContentAreaContextMenu, false);
    ZutiloChrome.firefoxOverlay.cleanupQueue.push(cleanupFFCACM);
}

// CACM = contentAreaContextMenu
function appendCACMCommandItems(parentElement, IDPrefix, nextElement) {

    var attachPageCmd = function(event) {
            var processType;
            if (event.shiftKey) {
                processType = 'prompt';
            } else if (event.ctrlKey) {
                processType = 'Zotero';
            }
            ZutiloChrome.firefoxOverlay.attachURLToCurrentItem(
                gBrowser.currentURI.spec, processType);
        };

    var attachLinkCmd = function(event) {
            var processType;
            if (event.shiftKey) {
                processType = 'prompt';
            } else if (event.ctrlKey) {
                processType = 'Zotero';
            }
            ZutiloChrome.firefoxOverlay.attachURLToCurrentItem(
                window.gContextMenu.linkURL, processType);
        };

    var commands = [attachPageCmd, attachLinkCmd];

    for (var index = 0; index < Zutilo.ffcacmFunctions.length; index++) {
        appendCACMSingleItem(parentElement, IDPrefix,
                             Zutilo.ffcacmFunctions[index].name,
                             commands[index], nextElement);
    }
}

function appendCACMSingleItem(parentElement, IDPrefix, IDSuffix, command,
    nextElement) {
    var menuEl = document.createElement('menuitem');
    var elementID = IDPrefix + IDSuffix;
    menuEl.setAttribute('id', elementID);
    menuEl.setAttribute('label',
        Zutilo._bundle.GetStringFromName('zutilo.ffcacm.' + IDSuffix));
    menuEl.addEventListener('command', command, false);
    parentElement.insertBefore(menuEl, nextElement);
    ZutiloChrome.XULRootElements.push(elementID);
}

function refreshContentAreaContextMenu() {
    var showMenuSeparator = false;

    for (var index = 0; index < Zutilo.ffcacmFunctions.length; index++) {
        var prefVal = Zutilo.Prefs.get(
            Zutilo.ffcacmFunctions[index].name + 'Appearance');

        var ffcacmMenuItem = document.getElementById(
            'zutilo-ffcacm-' + Zutilo.ffcacmFunctions[index].name);
        var zoteroMenuItem = document.getElementById(
            'zutilo-ffcacm-zoterosubmenu-' +
                Zutilo.ffcacmFunctions[index].name);

        var doNotShow = false;
        if (Zutilo.ffcacmFunctions[index].condition == 'onLink') {
            if (!window.gContextMenu.onLink) {
                doNotShow = true;
            }
        }

        if (prefVal == 'Firefox') {
            zoteroMenuItem.hidden = true;
            ffcacmMenuItem.hidden = doNotShow;
        } else if (prefVal == 'Zotero') {
            ffcacmMenuItem.hidden = true;
            zoteroMenuItem.hidden = doNotShow;
            if (!doNotShow) {
                showMenuSeparator = true;
            }
        } else {
            zoteroMenuItem.hidden = true;
            ffcacmMenuItem.hidden = true;
        }
    }

    var menuSeparator =
        document.getElementById('zutilo-ffcacm-zoterosubmenu-separator');
    if (showMenuSeparator) {
        menuSeparator.hidden = false;
    } else {
        menuSeparator.hidden = true;
    }
}

function cleanupFFCACM() {
    var FFContAreaContMenu = document.
        getElementById('contentAreaContextMenu');
    FFContAreaContMenu.removeEventListener('popupshowing',
        ZutiloChrome.firefoxOverlay.refreshContentAreaContextMenu, false);
}


/**************************************************************************/
// Status bar icon functions
/**************************************************************************/
function getStatusPopup() {
    var statusPopupEl = []
    var oldElement = document.
        getElementById('zotero-status-image-context');
    // For version > 4.0.26.1
    if (oldElement) {
        statusPopupEl.push(oldElement)
    } else {
        for (let buttonID of ['zotero-toolbar-save-button',
                          'zotero-toolbar-save-button-single']) {
            let statusButton = document.getElementById(buttonID)
            if (statusButton) {
                statusPopupEl.push(statusButton.children[0])
            }
        }
    }

    return statusPopupEl
}

function setupStatusPopup() {
    var statusPopupEl = getStatusPopup()
    for (let menupopup of statusPopupEl) {
        menupopup.addEventListener('popupshowing', statusPopupListener, false)
    }

    if (statusPopupEl) {
        ZutiloChrome.firefoxOverlay.cleanupQueue.push(cleanupStatusPopup)
    }
}
ZutiloChrome.firefoxOverlay.setupStatusPopup = setupStatusPopup

function cleanupStatusPopup() {
    var statusPopupEl = getStatusPopup()
    if (statusPopupEl) {
        for (let menupopup of statusPopupEl) {
            menupopup.removeEventListener('popupshowing',
                                          statusPopupListener, false)
        }
    }
}

function statusPopupListener(e) {
    if (!Zutilo.Prefs.get('showStatusPopupItems')) {
        return
    }

    var popup = e.target;

    // Get array of relevant status popup entries that correspond to normal
    // translators which might download attachment items.
    var translatorEntries = []
    for (let entry of popup.children) {
        if (entry.tagName == 'menuseparator') {
            break
        } else {
            translatorEntries.push(entry)
        }
    }

    // Ignore the last two entries before the first menuseparator because they
    // are generic web page translators.
    translatorEntries.splice(translatorEntries.length - 2, 2)
    if (translatorEntries.length === 0) {
        return
    }

    // Add menu separator and new entries
    var menuSep = document.createElement('menuseparator');
    menuSep.setAttribute('id', 'zutilo-zoterostatuspopup-menusep');
    popup.appendChild(menuSep);

    // New entries should have callbacks that call doCommand on existing
    // entries and watch isScraping to change associated files preference
    for (let entry of translatorEntries) {
        addStatusEntry(popup, entry)
    }
}

function addStatusEntry(popup, entry) {
    var labelEnd
    var strRoot = 'zutilo.pagescrape.statusPopup.'
    if (Zotero.Prefs.get('downloadAssociatedFiles')) {
        labelEnd = ' ' + Zutilo._bundle.
            GetStringFromName(strRoot + 'noAttachments')
    } else {
        labelEnd = ' ' + Zutilo._bundle.
            GetStringFromName(strRoot + 'withAttachments')
    }

    var menuitem = document.createElement('menuitem')
    var label = entry.label + labelEnd
    menuitem.setAttribute('label', label)
    menuitem.setAttribute('class', 'menuitem-iconic')

    menuitem.addEventListener('command',
                              function(e) {
                                  // Must stop propagation to prevent Zotero
                                  // from also saving item with its default
                                  // behavior
                                  e.stopPropagation()
                                  scrapeThisPage('opposite', entry)},
                              false);
    popup.appendChild(menuitem);
}

function scrapeThisPage(filesBehavior, entry) {
    // Don't allow simultaneous scraping
    if (Zotero_Browser.isScraping) {
        let strRoot = 'zutilo.pagescrape.multipleExecution.'
        Services.prompt.alert(null,
            Zutilo._bundle.
                GetStringFromName(strRoot + 'title'),
            Zutilo._bundle.
                GetStringFromName(strRoot + 'body'))
        return
    } 

    // Default to default translator
    if (typeof entry === 'undefined') {
        entry = document.getElementById('zotero-toolbar-save-button')
    }

    // Flip associated files pref
    let filesBool = Zotero.Prefs.get('downloadAssociatedFiles')
    if (filesBehavior == 'with') {
        Zotero.Prefs.set('downloadAssociatedFiles', true)
    } else if (filesBehavior == 'without') {
        Zotero.Prefs.set('downloadAssociatedFiles', false)
    } else {
        // opposite
        Zotero.Prefs.set('downloadAssociatedFiles', !filesBool)
    }

    // Define clean up actions to restore previous state after scraping
    function cleanupScraping() {
        Zotero.Prefs.set('downloadAssociatedFiles', filesBool)
        Zotero_Browser.unwatch('isScraping')
        ZutiloChrome.firefoxOverlay.isScraping = false
        window.clearTimeout(ZutiloChrome.firefoxOverlay.scrapeTimeout)
    }

    // Watch for end of scraping so that clean up can be done
    Zotero_Browser.watch('isScraping', function(id, oldval, newval) {
        if (newval === false) {
            cleanupScraping()
        }
    })

    // Set timer to clean up if watch never triggers (due to some failure)
    ZutiloChrome.firefoxOverlay.scrapeTimeout =
        window.setTimeout(cleanupScraping, 60000)

    // Start translation
    ZutiloChrome.firefoxOverlay.isScraping = true
    entry.doCommand()
}

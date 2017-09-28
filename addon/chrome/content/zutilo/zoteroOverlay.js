/* Copyright 2012 Will Shanks.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';
/* global gBrowser, window, document, Components */
/* global Zotero, ZoteroPane */
/* global Zutilo, ZutiloChrome */
Components.utils.import('resource://gre/modules/Services.jsm');
Components.utils.import('chrome://zutilo/content/zutilo.jsm');

ZutiloChrome.zoteroOverlay = {
    /******************************************/
    // Window load handling
    /******************************************/
    init: function() {
        this.fullOverlay();

        if (Zutilo.appName == 'Firefox') {
            gBrowser.addEventListener('load',
                ZutiloChrome.zoteroOverlay.pageloadListener, true);
        }
    },

    unload: function() {
        if (Zutilo.appName == 'Firefox') {
            gBrowser.removeEventListener('load',
                ZutiloChrome.zoteroOverlay.pageloadListener, true);
        }
        if (Zotero.version.split('.')[0] > 4) {
            // XXX: Legacy 4.0
            var toolsPopup = document.getElementById('menu_ToolsPopup')
            toolsPopup.removeEventListener('popupshowing',
                ZutiloChrome.zoteroOverlay.prefsSeparatorListener, false)
        }
    },

    /******************************************/
    // Functions for GUI keyboard shortcuts
    /******************************************/
    editItemInfoGUI: function() {
        var zitems = this.getSelectedItems('regular');
        if (!this.checkItemNumber(zitems, 'regularSingle')) {
            return false;
        }

        // Select info tab of item pane
        var tabIndex = 0;
        var zoteroViewTabbox =
            ZoteroPane.document.getElementById('zotero-view-tabbox');
        zoteroViewTabbox.selectedIndex = tabIndex;
        // Focus first entry textbox of info pane
        ZoteroPane.document.getElementById('zotero-editpane-item-box').
            focusFirstField('info');

        return true;
    },

    addNoteGUI: function() {
        var zitems = this.getSelectedItems('regular');
        if (!this.checkItemNumber(zitems, 'regularSingle')) {
            return false;
        }

        // Select note tab of item pane
        var tabIndex = 1;
        var zoteroViewTabbox =
            ZoteroPane.document.getElementById('zotero-view-tabbox');
        zoteroViewTabbox.selectedIndex = tabIndex;
        // Create new note
        if (Zotero.version.split('.')[0] < 5) {
            // XXX: Legacy 4.0
            ZoteroPane.newNote(false, zitems[0].id);
            // This version didn't work in tab mode:
            // ZoteroItemPane.addNote(false);
        } else {
            ZoteroPane.newNote(false, zitems[0].key)
        }

        return true;
    },

    addTagGUI: function() {
        var zitems = this.getSelectedItems('regular');
        if (!this.checkItemNumber(zitems, 'regularSingle')) {
            return false;
        }

        // Select tag tab of item pane
        var tabIndex = 2;
        ZoteroPane.document.getElementById('zotero-view-tabbox').
            tabs.selectedIndex = tabIndex
        // Focus new tag entry textbox
        let tagPane =
            ZoteroPane.document.getElementById('zotero-editpane-tags')
        if (tagPane._tagColors === undefined) {
            window.setTimeout(function() {tagPane.new()}, 200)
        } else {
            if (typeof tagPane.newTag === 'function') {
                tagPane.newTag()
            } else {
                // XXX: Legacy 4.0
                tagPane.new()
            }
        }

        return true;
    },

    addRelatedGUI: function() {
        var zitems = this.getSelectedItems('regular');
        if (!this.checkItemNumber(zitems, 'regularSingle')) {
            return false;
        }

        // Select related tab of item pane
        var tabIndex = 3;
        var zoteroViewTabbox =
            ZoteroPane.document.getElementById('zotero-view-tabbox');
        zoteroViewTabbox.selectedIndex = tabIndex;
        // Open add related window
        ZoteroPane.document.getElementById('zotero-editpane-related').add();

        return true;
    },

    showItemPane: function() {
        var itemPane = ZoteroPane.document.getElementById('zotero-item-pane');
        if (itemPane.getAttribute('collapsed') == 'true') {
            itemPane.setAttribute('collapsed', 'false');
            ZoteroPane.document.getElementById('zotero-items-splitter').
                removeAttribute('state');
        }
    },

    updatePaneVisibility: function(paneName, command, keepSplitter) {
        var pane = ZoteroPane.document.getElementById(paneName + '-pane');
        // It is zotero-item-pane but zotero-items-splitter
        var splitterStr
        if (paneName == 'zotero-item') {
            splitterStr = 's-splitter'
        } else {
            splitterStr = '-splitter'
        }
        var splitter = ZoteroPane.document.getElementById(paneName +
                                                          splitterStr);

        switch (command) {
            case 'toggle':
                if (pane.collapsed) {
                    this.updatePaneVisibility(paneName, 'show', keepSplitter);
                } else {
                    this.updatePaneVisibility(paneName, 'hide', keepSplitter);
                }
                break;
            case 'show':
                pane.collapsed = false;
                if (!keepSplitter) {
                    splitter.removeAttribute('state');
                }
                break;
            case 'hide':
                pane.collapsed = true;
                splitter.setAttribute('state', 'collapsed');
                break;
        }
    },

    /******************************************/
    // Functions called from Zotero item menu
    /******************************************/
    _copyToClipboard: function(clipboardText) {
        if (clipboardText) {
            const gClipboardHelper =
                Components.classes['@mozilla.org/widget/clipboardhelper;1']
                .getService(Components.interfaces.nsIClipboardHelper);
            gClipboardHelper.copyString(clipboardText, document);
        } else {
            var prompts = Components.
                classes['@mozilla.org/embedcomp/prompt-service;1'].
                getService(Components.interfaces.nsIPromptService);
            var title = Zutilo._bundle.
                GetStringFromName('zutilo.error.copynoitemstitle')
            var text = Zutilo._bundle.
                GetStringFromName('zutilo.error.copynoitemstext')
            prompts.alert(null, title, text)
        }
    },

    copyCreators: function() {
        var zitems = this.getSelectedItems('regular');

        if (!this.checkItemNumber(zitems, 'regular1')) {
            return false;
        }

        var creatorsArray = [];
        for (let zitem of zitems) {
            let creators = zitem.getCreators()
            for (let creator of creators) {
                if (Zotero.version.split('.')[0] < 5) {
                    // XXX: Legacy 4.0
                    creator = creator.ref
                }
                let creatorStr = creator.lastName + '\t' + creator.firstName
                if (creatorsArray.indexOf(creatorStr) == -1) {
                    creatorsArray.push(creatorStr)
                }
            }
        }

        var clipboardText = creatorsArray.join('\r\n');

        this._copyToClipboard(clipboardText)

        return true;
    },

    copyTags: function() {
        var zitems = this.getSelectedItems(['regular', 'note', 'attachment']);

        if (!this.checkItemNumber(zitems, 'regularNoteAttachment1')) {
            return false;
        }

        var tagsArray = [];
        for (var i = 0; i < zitems.length; i++) {
            // The following line might be needed to work around some item
            // handling issues, but I will leave it out for now.
            // var tempID = Zotero.Items.getLibraryKeyHash(zitems[i]);
            var tempTags = zitems[i].getTags();
            var arrayStr = '';
            for (var j = 0; j < tempTags.length; j++) {
                arrayStr = '\n' + tagsArray.join('\n') + '\n';

                let tag
                if (Zotero.version.split('.')[0] < 5) {
                    // XXX: Legacy 4.0
                    tag = tempTags[j].name
                } else {
                    tag = tempTags[j].tag
                }

                if (arrayStr.indexOf('\n' + tag + '\n') == -1) {
                    tagsArray.push(tag);
                }
            }
        }
        var clipboardText = tagsArray.join('\r\n');

        this._copyToClipboard(clipboardText)

        return true;
    },

    removeTags: function() {
        var zitems = this.getSelectedItems(['regular', 'note', 'attachment']);

        if (!this.checkItemNumber(zitems, 'regularNoteAttachment1')) {
            return false;
        }

        for (let idx = 0; idx < zitems.length; idx++) {
            zitems[idx].removeAllTags()
            if (Zotero.version.split('.')[0] > 4) {
                // XXX: Legacy 4.0
                zitems[idx].saveTx()
            }
        }
    },

    copyChildIDs: function() {
        var zitems = this.getSelectedItems(['note', 'attachment']);
        if (zitems.length === 0) {
            return 0;
        }

        Zutilo.itemClipboard = [];
        for (var idx = 0; idx < zitems.length; idx++) {
            Zutilo.itemClipboard.push(zitems[idx].id);
        }
    },

    relocateChildren: function() {
        var zitems = this.getSelectedItems(['regular']);

        if (!this.checkItemNumber(zitems, 'regularSingle')) {
            return false;
        }
        var newParent = zitems[0];

        var child;
        for (var idx = 0; idx < Zutilo.itemClipboard.length; idx++) {
            child = Zotero.Items.get(Zutilo.itemClipboard[idx]);
            if (Zotero.version.split('.')[0] < 5) {
                // XXX: Legacy 4.0
                child.setSource(newParent.id);
                child.save();
            } else {
                child.parentKey = newParent.key
                child.saveTx()
            }
        }
    },

    pasteTags: function() {
        var zitems = this.getSelectedItems(['regular', 'note', 'attachment']);

        if (!this.checkItemNumber(zitems, 'regularNoteAttachment1')) {
            return false;
        }

        var clipboardText = ZutiloChrome.getFromClipboard().trim()
        if (!clipboardText) {
            return false;
        }

        var tagArray = clipboardText.split(/\r\n?|\n/)
        tagArray = tagArray.map(function(val) {return val.trim()});
        tagArray = tagArray.filter(Boolean)

        for (let zitem of zitems) {
            for (let tag of tagArray) {
                zitem.addTag(tag)
            }
            if (Zotero.version.split('.')[0] > 4) {
                // XXX: Legacy 4.0
                zitem.saveTx()
            }
        }

        return true;
    },

    _modifyAttachmentPaths: function(mode) {
        var attachmentArray = this.getSelectedAttachments();

        if (!this.checkItemNumber(attachmentArray, 'attachment1')) {
            return false;
        }
        var prompts = Components.
            classes['@mozilla.org/embedcomp/prompt-service;1'].
            getService(Components.interfaces.nsIPromptService);
        var promptTitle
        if (mode == Zotero.Attachments.LINK_MODE_LINKED_FILE) {
            promptTitle = Zutilo._bundle.
                GetStringFromName('zutilo.attachments.modifyTitle')
        } else if (mode == Zotero.Attachments.LINK_MODE_LINKED_URL) {
            promptTitle = Zutilo._bundle.
                GetStringFromName('zutilo.attachments.modifyURLTitle')
        }

        // Prompt for old path
        var promptText = { value: '' };
        var checkGlobal = { value: false };
        var pressedOK = prompts.prompt(null, promptTitle,
            Zutilo._bundle.GetStringFromName('zutilo.attachments.oldPath'),
            promptText,
            Zutilo._bundle.
                GetStringFromName('zutilo.attachments.checkGlobally'),
                                  checkGlobal);
        var oldPath = promptText.value;
        if (!pressedOK || (oldPath === '')) {
            return false;
        }

        // Prompt for new path
        promptText = { value: '' };
        pressedOK = prompts.prompt(null, promptTitle,
            Zutilo._bundle.GetStringFromName('zutilo.attachments.newPath'),
            promptText, null, {});
        var newPath = promptText.value;
        if (!pressedOK) {
            return false;
        }

        function getPath(attachment) {
            if (mode == Zotero.Attachments.LINK_MODE_LINKED_FILE) {
                return attachment.attachmentPath
            } else if (mode == Zotero.Attachments.LINK_MODE_LINKED_URL) {
                return attachment.getField('url')
            }
        }

        function setPath(attachment, path) {
            if (mode == Zotero.Attachments.LINK_MODE_LINKED_FILE) {
                attachment.attachmentPath = path
            } else if (mode == Zotero.Attachments.LINK_MODE_LINKED_URL) {
                attachment.setField('title', path)
                attachment.setField('url', path)
            }
        }

        // Loop through attachments and replace partial paths
        var attachmentPath;
        var newFullPath
        for (var index = 0; index < attachmentArray.length; index++) {
            // Only modify linked file attachments since paths for the other
            // attachment types are managed by Zotero.
            if (attachmentArray[index].attachmentLinkMode != mode) {
                continue
            }
            var oldFullPath = getPath(attachmentArray[index])
            if (checkGlobal.value) {
                newFullPath =
                    oldFullPath.replace(
                        new RegExp(Zutilo.escapeForRegExp(oldPath), 'g'),
                        newPath);
            } else {
                // If only check beginning of strings, just do quick compare
                // and substitution (I think this might be faster than
                // replace() ).
                if (oldFullPath.substr(0, oldPath.length) == oldPath) {
                    newFullPath =
                        newPath + oldFullPath.substr(oldPath.length);
                }
            }
            // attachmentPath stores the unmodified path
            // only save to database if path was actually modified
            if (newFullPath != oldFullPath) {
                // TODO: wrap all saves in one transaction
                setPath(attachmentArray[index], newFullPath)
                if (typeof attachmentArray[index].saveTx === 'function') {
                    attachmentArray[index].saveTx();
                } else {
                    // XXX: Legacy 4.0
                    attachmentArray[index].save();
                }
            }
        }

        return true;
    },

    modifyAttachments: function() {
        this._modifyAttachmentPaths(Zotero.Attachments.LINK_MODE_LINKED_FILE)
    },

    modifyURLAttachments: function() {
        this._modifyAttachmentPaths(Zotero.Attachments.LINK_MODE_LINKED_URL)
    },

    showAttachments: function() {
        var attachmentArray = this.getSelectedAttachments();

        if (!this.checkItemNumber(attachmentArray, 'attachment1')) {
            return false;
        }

        var prompts = Components.
            classes['@mozilla.org/embedcomp/prompt-service;1'].
            getService(Components.interfaces.nsIPromptService);
        for (var index = 0; index < attachmentArray.length; index++) {
            var title = Zutilo._bundle.
                formatStringFromName('zutilo.attachments.showTitle',
                [index + 1, attachmentArray.length], 2);
            var text
            if (attachmentArray[index].attachmentLinkMode ==
                    Zotero.Attachments.LINK_MODE_LINKED_URL) {
                text = attachmentArray[index].getField('url')
            } else {
                text = attachmentArray[index].attachmentPath
            }
            prompts.alert(null, title, text);
        }
        return true;
    },

    copyAttachmentPaths: function() {
        var attachmentArray = this.getSelectedAttachments();

        if (!this.checkItemNumber(attachmentArray, 'attachment1')) {
            return false;
        }

        var paths = []
        for (let attachment of attachmentArray) {
            let path
            if (Zotero.version.split('.')[0] < 5) {
                // XXX: Legacy 4.0
                if (attachment.attachmentLinkMode !=
                        Zotero.Attachments.LINK_MODE_LINKED_URL) {
                    path = attachment.getFile().path
                }
            } else {
                path = attachment.getFilePath()
            }
            if (path) {
                paths.push(path)
            }
        }

        if (paths.length > 0) {
            var clipboardText = paths.join('\r\n')

            this._copyToClipboard(clipboardText)
        }

        return true;
    },

    relateItems: function() {
        var zitems = this.getSelectedItems(['regular', 'note', 'attachment']);

        if (!this.checkItemNumber(zitems, 'regularNoteAttachment2')) {
            return false;
        }

        for (let zitem of zitems) {
            for (let addItem of zitems) {
                if (zitem != addItem) {
                    if (Zotero.version.split('.')[0] < 5) {
                        // XXX: Legacy 4.0
                        zitem.addRelatedItem(addItem.id)
                    } else {
                        zitem.addRelatedItem(addItem)
                    }
                }
            }
            if (Zotero.version.split('.')[0] > 4) {
                // XXX: Legacy 4.0
                zitem.saveTx()
            } else {
                zitem.save()
            }
        }

        return true;
    },

    copyItems: function() {
        ZoteroPane.copySelectedItemsToClipboard(false);
        return true;
    },

    copyItems_alt1: function() {
        var pref = 'export.quickCopy.setting'
        var origSetting = Zotero.Prefs.get(pref)
        var newSetting = Zutilo.Prefs.get('quickCopy_alt1')
        Zotero.Prefs.set(pref, newSetting)
        ZoteroPane.copySelectedItemsToClipboard(false)
        Zotero.Prefs.set(pref, origSetting)
        return true
    },

    copyItems_alt2: function() {
        var pref = 'export.quickCopy.setting'
        var origSetting = Zotero.Prefs.get(pref)
        var newSetting = Zutilo.Prefs.get('quickCopy_alt2')
        Zotero.Prefs.set(pref, newSetting)
        ZoteroPane.copySelectedItemsToClipboard(false)
        Zotero.Prefs.set(pref, origSetting)
        return true
    },

    copyZoteroSelectLink: function() {
        var zitems = this.getSelectedItems();
        var links = [];

        if (!this.checkItemNumber(zitems, 'regularNoteAttachment1')) {
            return false;
        }

        var libraryID;
        for (var ii = 0; ii < zitems.length; ii++) {
            libraryID = zitems[ii].libraryID ? zitems[ii].libraryID : 0;
            links.push('zotero://select/items/' +
                       libraryID + '_' + zitems[ii].key);
        }

        var clipboardText = links.join('\r\n');

        this._copyToClipboard(clipboardText)

        return true;
    },

    copyZoteroItemURI: function() {
        var zitems = this.getSelectedItems();
        var links = [];

        if (!this.checkItemNumber(zitems, 'regularNoteAttachment1')) {
            return false;
        }

        for (var ii = 0; ii < zitems.length; ii++) {
            links.push(Zotero.URI.getItemURI(zitems[ii]));
        }

        var clipboardText = links.join('\r\n');

        this._copyToClipboard(clipboardText)

        return true;
    },

    createBookSection: function() {
        // Validate item selection
        var zitems = this.getSelectedItems();

        if (!this.checkItemNumber(zitems, 'regularSingle')) {
            return false;
        }

        var bookItem = zitems[0];
        if (bookItem.itemTypeID != Zotero.ItemTypes.getID('book')) {
            var prompts =
                Components.classes['@mozilla.org/embedcomp/prompt-service;1'].
                getService(Components.interfaces.nsIPromptService);
            prompts.alert(null,
                Zutilo._bundle.
                    GetStringFromName('zutilo.error.bookitemtitle'),
                Zutilo._bundle.
                    GetStringFromName('zutilo.error.bookitemmessage'));
            return false;
        }

        function modifyNewItem(context, sectionItem) {
            // Set item type
            sectionItem.setType(Zotero.ItemTypes.getID('bookSection'));

            // Change authors to book authors
            var creators = sectionItem.getCreators();
            for (var index = 0; index < creators.length; index++) {
                if (creators[index].creatorTypeID ==
                        Zotero.CreatorTypes.getID('author')) {
                    creators[index] = Zotero.CreatorTypes.getID('bookAuthors');
                }
            }

            // Relate items
            if (Zotero.version.split('.')[0] < 5) {
                // XXX: Legacy 4.0
                bookItem.addRelatedItem(sectionItem.id);
                sectionItem.addRelatedItem(bookItem.id);

                sectionItem.save()
                bookItem.save()

                // Update GUI and select textbox
                // document.getElementById('zotero-editpane-item-box').refresh()
                context.editItemInfoGUI();
            } else {
                bookItem.addRelatedItem(sectionItem);
                sectionItem.addRelatedItem(bookItem);

                Zotero.Promise.coroutine(function*() {
                    yield sectionItem.saveTx()
                    yield bookItem.saveTx()

                    // Update GUI and select textbox
                    context.editItemInfoGUI()
                })()
            }
        }

        // Duplicate item and then do the work
        if (Zotero.version.split('.')[0] < 5) {
            // XXX: Legacy 4.0
            ZoteroPane.duplicateSelectedItem();
            zitems = this.getSelectedItems();
            var sectionItem = zitems[0];
            modifyNewItem(this, sectionItem)
        } else {
            Zotero.Promise.coroutine(function*(context) {
                let sectionItem = yield ZoteroPane.duplicateSelectedItem()
                modifyNewItem(context, sectionItem)
            })(this)
        }

        return true;
    },

    createBookItem: function() {
        // Validate item selection
        var zitems = this.getSelectedItems();

        if (!this.checkItemNumber(zitems, 'regularSingle')) {
            return false;
        }

        var sectionItem = zitems[0];
        if (sectionItem.itemTypeID != Zotero.ItemTypes.getID('bookSection')) {
            var prompts =
                Components.classes['@mozilla.org/embedcomp/prompt-service;1'].
                getService(Components.interfaces.nsIPromptService);
            prompts.alert(null,
                Zutilo._bundle.
                    GetStringFromName('zutilo.error.booksectiontitle'),
                Zutilo._bundle.
                    GetStringFromName('zutilo.error.booksectionmessage'));
            return false;
        }

        function modifyNewItem(context, bookItem) {
            bookItem.setType(Zotero.ItemTypes.getID('book'));

            // Change book title to title
            var bookTitleField = Zotero.ItemFields.getID('bookTitle');
            var titleField = Zotero.ItemFields.getID('title');
            var bookTitle = sectionItem.getField(bookTitleField);
            if (bookTitle !== '') {
                bookItem.setField(titleField, bookTitle);
            }
            bookItem.setField(Zotero.ItemFields.getID('abstractNote'), '')

            // Relate items
            if (Zotero.version.split('.')[0] < 5) {
                // XXX: Legacy 4.0
                bookItem.addRelatedItem(sectionItem.id)
                sectionItem.addRelatedItem(bookItem.id)

                bookItem.save()
                sectionItem.save()

                // Update GUI and select textbox
                document.getElementById('zotero-editpane-item-box').refresh()
                context.editItemInfoGUI();
            } else {
                bookItem.addRelatedItem(sectionItem)
                sectionItem.addRelatedItem(bookItem)

                Zotero.Promise.coroutine(function*() {
                    yield sectionItem.saveTx()
                    yield bookItem.saveTx()

                    // Update GUI and select textbox
                    context.editItemInfoGUI()
                })()
            }
        }

        // Duplicate item and then do the work
        if (Zotero.version.split('.')[0] < 5) {
            // XXX: Legacy 4.0
            ZoteroPane.duplicateSelectedItem();
            zitems = this.getSelectedItems();
            var bookItem = zitems[0];
            modifyNewItem(this, bookItem)
        } else {
            Zotero.Promise.coroutine(function*(context) {
                let bookItem = yield ZoteroPane.duplicateSelectedItem()
                modifyNewItem(context, bookItem)
            })(this)
        }


        return true;
    },

    /******************************************/
    // XUL overlay functions
    /******************************************/
    fullOverlay: function() {
        // Add all Zutilo overlay elements to the window
        ZutiloChrome.actOnAllDocuments(ZutiloChrome.zoteroOverlay.
                                       overlayZoteroPane);
        this.initKeys();

        if (Zotero.version.split('.')[0] > 4) {
            // XXX: Legacy 4.0
            var toolsPopup = document.getElementById('menu_ToolsPopup')
            toolsPopup.addEventListener('popupshowing',
                ZutiloChrome.zoteroOverlay.prefsSeparatorListener, false)
        }
    },

    overlayZoteroPane: function(doc) {
        var prefsId
        var menuPopup
        if (Zotero.version.split('.')[0] < 5) {
            // XXX: Legacy 4.0
            menuPopup = doc.getElementById('zotero-tb-actions-prefs').
                parentElement
        } else {
            menuPopup = doc.getElementById('menu_ToolsPopup')
        }
        ZutiloChrome.zoteroOverlay.prefsMenuItem(doc, menuPopup)
        ZutiloChrome.zoteroOverlay.zoteroItemPopup(doc)
    },

    prefsSeparatorListener: function() {
        var addonsMenuItem = document.getElementById('menu_addons')
        var nextSibling = addonsMenuItem
        var needSeparator = true
        while (nextSibling) {
            if (nextSibling.nodeName == 'menuseparator') {
                needSeparator = false
                break
            }
            nextSibling = nextSibling.nextSibling
        }
        if (needSeparator) {
            var zutiloSeparator = document.createElement('menuseparator')
            zutiloSeparator.setAttribute('id', 'zutilo-toolsmenu-separator')
            var toolsPopup = document.getElementById('menu_ToolsPopup')
            toolsPopup.insertBefore(zutiloSeparator,
                addonsMenuItem.nextSibling)
            var removeListener = function() {
                toolsPopup.removeChild(zutiloSeparator)
                toolsPopup.removeEventListener('popuphiding',
                    removeListener, false)
            }
            toolsPopup.addEventListener('popuphiding', removeListener,
                false)
        }
    },

    pageloadListener: function(event) {
        if (event.originalTarget.location == Zutilo.zoteroTabURL) {
            ZutiloChrome.zoteroOverlay.overlayZoteroPane(event.originalTarget);
        }
    },

    prefsMenuItem: function(doc, menuPopup) {
        // Add Zutilo preferences item to Tools menu
        if (menuPopup === null) {
            // Don't do anything if elements not loaded yet
            return;
        }

        var zutiloMenuItem = doc.createElement('menuitem')
        var zutiloMenuItemID = 'zutilo-preferences'
        zutiloMenuItem.setAttribute('id', zutiloMenuItemID)
        zutiloMenuItem.setAttribute('label',
            Zutilo._bundle.
                GetStringFromName('zutilo.preferences.menuitem'))
        zutiloMenuItem.addEventListener('command',
            function() {
                ZutiloChrome.openPreferences()
            }, false)

        menuPopup.appendChild(zutiloMenuItem)

        ZutiloChrome.registerXUL(zutiloMenuItemID, doc)
    },

    /******************************************/
    // Item menu functions
    /******************************************/
    // Create XUL for Zotero item menu elements
    zoteroItemPopup: function(doc) {
        var zoteroItemmenu = doc.getElementById('zotero-itemmenu');
        if (zoteroItemmenu === null) {
            // Don't do anything if elements not loaded yet
            return;
        }

        var zutiloSeparator = doc.createElement('menuseparator');
        var zutiloSeparatorID = 'zutilo-itemmenu-separator';
        zutiloSeparator.setAttribute('id', zutiloSeparatorID);
        zoteroItemmenu.appendChild(zutiloSeparator);
        ZutiloChrome.registerXUL(zutiloSeparatorID, doc);

        this.createItemmenuItems(zoteroItemmenu, 'zutilo-zoteroitemmenu-',
                                 true, doc);

        // Zutilo submenu
        var zutiloSubmenu = doc.createElement('menu');
        var zutiloSubmenuID = 'zutilo-itemmenu-submenu';
        zutiloSubmenu.setAttribute('id', zutiloSubmenuID);
        zutiloSubmenu.setAttribute('label',
            Zutilo._bundle.GetStringFromName('zutilo.itemmenu.zutilo'));
        zoteroItemmenu.appendChild(zutiloSubmenu);
        ZutiloChrome.registerXUL(zutiloSubmenuID, doc);

        // Zutilo submenu popup
        var zutiloSubmenuPopup = doc.createElement('menupopup');
        zutiloSubmenuPopup.setAttribute('id', 'zutilo-itemmenu-submenupopup');
        zutiloSubmenu.appendChild(zutiloSubmenuPopup);

        this.createItemmenuItems(zutiloSubmenuPopup, 'zutilo-zutiloitemmenu-',
                                 false, doc);

        this.refreshZoteroItemPopup(doc);
    },

    // Update hidden state of Zotero item menu elements
    refreshZoteroItemPopup: function(doc) {
        if (typeof doc == 'undefined') {
            doc = document;
        }
        var showMenuSeparator = false;
        var showSubmenu = false;

        for (var index = 0; index < Zutilo._itemmenuFunctions.length; index++) {
            var prefVal = Zutilo.Prefs.get('itemmenu.' +
                                           Zutilo._itemmenuFunctions[index]);

            var zutiloMenuItem = doc.getElementById(
                'zutilo-zutiloitemmenu-' + Zutilo._itemmenuFunctions[index]);
            var zoteroMenuItem = doc.getElementById(
                'zutilo-zoteroitemmenu-' + Zutilo._itemmenuFunctions[index]);

            if (prefVal == 'Zotero') {
                showMenuSeparator = true;
                zutiloMenuItem.hidden = true;
                zoteroMenuItem.hidden = false;
            } else if (prefVal == 'Zutilo') {
                showMenuSeparator = true;
                showSubmenu = true;
                zutiloMenuItem.hidden = false;
                zoteroMenuItem.hidden = true;
            } else {
                zutiloMenuItem.hidden = true;
                zoteroMenuItem.hidden = true;
            }
        }

        var menuSeparator = doc.getElementById('zutilo-itemmenu-separator');
        if (showMenuSeparator) {
            menuSeparator.hidden = false;
        } else {
            menuSeparator.hidden = true;
        }

        var submenu = doc.getElementById('zutilo-itemmenu-submenu');
        if (showSubmenu) {
            submenu.hidden = false;
        } else {
            submenu.hidden = true;
        }
    },

    // Create Zotero item menu items as children of menuPopup
    createItemmenuItems: function(menuPopup, IDPrefix, elementsAreRoot, doc) {
        var menuFunc;
        for (var index = 0;index < Zutilo._itemmenuFunctions.length;index++) {
            menuFunc = this.zoteroItemmenuItem(
                Zutilo._itemmenuFunctions[index], IDPrefix, doc);
            menuPopup.appendChild(menuFunc);
            if (elementsAreRoot) {
                ZutiloChrome.registerXUL(menuFunc.id, doc);
            }
        }
    },

    // Create Zotero item menu item
    zoteroItemmenuItem: function(functionName, IDPrefix, doc) {
        var menuFunc = doc.createElement('menuitem');
        menuFunc.setAttribute('id', IDPrefix + functionName);
        menuFunc.setAttribute('label',
            Zutilo._bundle.GetStringFromName('zutilo.itemmenu.' +
                                             functionName));
        menuFunc.addEventListener('command',
            function() {
                ZutiloChrome.zoteroOverlay[functionName]();
            }, false);
        return menuFunc;
    },

    /******************************************/
    // Keyboard shortcut functions
    /******************************************/
    initKeys: function() {
        var keyset = document.createElement('keyset');
        this.keyset = keyset;
        this.keyset.setAttribute('id', 'zutilo-keyset');
        document.getElementById('mainKeyset').parentNode.
            appendChild(this.keyset);
        ZutiloChrome.XULRootElements.push(this.keyset.id);

        for (var keyLabel in Zutilo.keys.shortcuts) {
            this.createKey(keyLabel);
        }
    },

    createKey: function(keyLabel) {
        var key = document.createElement('key');
        key.setAttribute('id', Zutilo.keys.keyID(keyLabel));
        this.keyset.appendChild(key);
        // Set label attribute so that keys show up nicely in keyconfig
        // extension
        key.setAttribute('label', 'Zutilo: ' + Zutilo.keys.keyName(keyLabel));
        // key.setAttribute('command', 'zutilo-keyset-command');
        key.setAttribute('oncommand', '//');
        key.addEventListener('command',
            function() {
                Zutilo.keys.shortcuts[keyLabel](window);
            });

        var keyObj = Zutilo.keys.getKey(keyLabel);

        if (keyObj.modifiers) {
            key.setAttribute('modifiers', keyObj.modifiers);
        }
        if (keyObj.key) {
            key.setAttribute('key', keyObj.key);
        } else if (keyObj.keycode) {
            key.setAttribute('key', keyObj.key);
        } else {
            // No key or keycode.  Set to empty string to disable.
            key.setAttribute('key', '');
        }
    },

    updateKey: function(keyLabel) {
        var key = document.getElementById(Zutilo.keys.keyID(keyLabel));

        key.removeAttribute('modifiers');
        key.removeAttribute('key');
        key.removeAttribute('keycode');

        var keyObj = Zutilo.keys.getKey(keyLabel);

        if (keyObj.modifiers) {
            key.setAttribute('modifiers', keyObj.modifiers);
        }
        if (keyObj.key) {
            key.setAttribute('key', keyObj.key);
        } else if (keyObj.keycode) {
            key.setAttribute('key', keyObj.key);
        } else {
            // No key or keycode.  Set to empty string to disable.
            key.setAttribute('key', '');
        }

        // Regenerate keys
        var keyset = this.keyset;
        keyset.parentNode.insertBefore(keyset, keyset.nextSibling);
    },

    /******************************************/
    // Zotero item selection and sorting
    /******************************************/

    // Get all selected attachment items and all of the child attachments of
    // all selected regular items.
    // To get just the selected attachment items, use
    // Zutilo.siftItems(inputArray, 'attachment') instead.
    getSelectedAttachments: function() {

        var zitems = this.getSelectedItems();
        if (!zitems) {
            return [];
        }

        // Add child attachments of all selected regular items to
        // attachmentItems
        var zitem;
        var attachmentItems = [];
        while (zitems.length > 0) {
            zitem = zitems.shift();

            if (zitem.isRegularItem()) {
                attachmentItems =
                    attachmentItems.concat(Zotero.Items.
                                           get(zitem.getAttachments(false)));
            } else if (zitem.isAttachment()) {
                attachmentItems.push(zitem);
            }
        }

        // Return attachments after removing duplicate items (when parent and
        // child are selected)
        return this.removeDuplicateItems(attachmentItems);
    },

    // Return array with the selected item objects.  If itemType is passed,
    // return only items of that type (or types if itemType is an array)
    getSelectedItems: function(itemType) {
        var zitems = window.ZoteroPane.getSelectedItems();
        if (!zitems.length) {
            return false;
        }

        if (itemType) {
            if (!Array.isArray(itemType)) {
                itemType = [itemType];
            }
            var siftedItems = this.siftItems(zitems, itemType);
            return siftedItems.matched;
        } else {
            return zitems;
        }
    },

    checkItemType: function(itemObj, itemTypeArray) {
        var matchBool = false;

        for (var idx = 0; idx < itemTypeArray.length; idx++) {
            switch (itemTypeArray[idx]) {
                case 'attachment':
                    matchBool = itemObj.isAttachment();
                    break;
                case 'note':
                    matchBool = itemObj.isNote();
                    break;
                case 'regular':
                    matchBool = itemObj.isRegularItem();
                    break;
                default:
                    matchBool = Zotero.ItemTypes.getName(itemObj.itemTypeID) ==
                        itemTypeArray[idx];
            }

            if (matchBool) {
                break;
            }
        }

        return matchBool;
    },

    // Remove duplicate Zotero item objects from itemArray
    removeDuplicateItems: function(itemArray) {
        // Get array of itemID's
        var itemIDArray = [];
        for (var index = 0;index < itemArray.length;index++) {
            itemIDArray[index] = itemArray[index].itemID;
        }

        // Create array of unique itemID's
        var tempObject = {};
        var uniqueIDs = [];
        for (index = 0;index < itemIDArray.length;index++) {
            tempObject[itemIDArray[index]] = itemIDArray[index];
        }
        for (index in tempObject) {
            uniqueIDs.push(tempObject[index]);
        }

        return Zotero.Items.get(uniqueIDs);
    },

    // Separate itemArray into an array of items with type itemType and an
    // array with those with different item types
    siftItems: function(itemArray, itemTypeArray) {
        var matchedItems = [];
        var unmatchedItems = [];
        var numItems = itemArray.length;
        while (itemArray.length > 0) {
            if (this.checkItemType(itemArray[0], itemTypeArray)) {
                matchedItems.push(itemArray.shift());
            } else {
                unmatchedItems.push(itemArray.shift());
            }
        }

        return {
            matched: matchedItems,
            unmatched: unmatchedItems
        };
    },

    // Check number of items in itemArray and show error message if it does not
    // match checkType. Note that checkType sets the number to be checked and
    // the error message to display. The actual item types are not checked.
    checkItemNumber: function(itemArray, checkType) {
        var checkBool = true;

        var prompts = Components.
            classes['@mozilla.org/embedcomp/prompt-service;1'].
            getService(Components.interfaces.nsIPromptService);

        var errorTitle = Zutilo._bundle.
            GetStringFromName('zutilo.checkItems.errorTitle');
        switch (checkType) {
            case 'regular1':
            case 'regularOrNote1':
            case 'regularNoteAttachment1':
                if (!itemArray.length) {
                    prompts.alert(null, errorTitle, Zutilo._bundle.
                        GetStringFromName('zutilo.checkItems.' + checkType));
                    checkBool = false;
                }
                break;
            case 'regularSingle':
                if ((!itemArray.length) || (itemArray.length > 1)) {
                    prompts.alert(null, errorTitle, Zutilo._bundle.
                        GetStringFromName('zutilo.checkItems.regularSingle'));
                    checkBool = false;
                }
                break;
            case 'regular2':
            case 'regularOrNote2':
            case 'regularNoteAttachment2':
                if ((!itemArray.length) || (itemArray.length < 2)) {
                    prompts.alert(null, errorTitle, Zutilo._bundle.
                        GetStringFromName('zutilo.checkItems.' + checkType));
                    checkBool = false;
                }
                break;
            case 'attachment1':
                if (!itemArray.length) {
                    prompts.alert(null, errorTitle, Zutilo._bundle.
                        GetStringFromName('zutilo.checkItems.attachment1'));
                    checkBool = false;
                }
                break;
        }

        return checkBool;
    }
};

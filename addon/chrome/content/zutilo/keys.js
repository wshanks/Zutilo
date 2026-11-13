/* Copyright 2012 Will Shanks.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';
/* global Components, AddonManager, Services */
/* global Zotero */
/* global Zutilo */

/********************************************/
// Include core modules and built-in modules
/********************************************/
var { AddonManager } = ChromeUtils.importESModule("resource://gre/modules/AddonManager.sys.mjs");
var { Zutilo } = ChromeUtils.importESModule("chrome://zutilo/content/zutilo.mjs");

/********************************************/
// Define keys object
/********************************************/
var keys = {
    getKey: function(keyLabel) {
        return JSON.parse(Zutilo.Prefs.get('shortcut.' + keyLabel))
    },

    setKey: function(keyLabel, key) {
        Zutilo.Prefs.set('shortcut.' + keyLabel, JSON.stringify(key))
    },

    keyName: function(keyLabel) {
        var name = Zutilo.getString('zutilo.shortcuts.name.' + keyLabel)
        return name
    },

    keyID: function(keyLabel) {
        return 'zutilo-key-' + keyLabel
    },

    categoryName: function(categoryLabel) {
        return Zutilo.getString('zutilo.shortcuts.category.' + categoryLabel)
    },

    refreshAlts: function() {
        for (let alt in Zutilo.keys.alts) {
            let deletions = []
            for (let shortcut in Zutilo.keys.shortcuts) {
                if (shortcut.startsWith(alt)) {
                    deletions.push(shortcut)
                }
            }
            for (let shortcut of deletions) {
                delete Zutilo.keys.shortcuts[shortcut]
                delete Zutilo.keys.categories[shortcut]
            }

            let total = Zutilo.Prefs.get(alt + '_total')
            for (let altNum = 1; altNum < total + 1; altNum++) {
                Zutilo.keys.categories[alt + altNum] = Zutilo.keys.alts[alt]['category']
                Zutilo.keys.shortcuts[alt + altNum] = Zutilo.keys.alts[alt]['generator'](altNum)
            }
        }
    },

    // An element of the library view by its id. Zotero 11 can hold several
    // library tabs in a window, each with its own toolbar and panes, so an
    // id is looked up in the active one first.
    libraryElement: function(win, id) {
        let view = win.ZoteroPane.libraryView;
        let elem = view && view.getElement ? view.getElement(id) : null;
        return elem || win.document.getElementById(id);
    },

    // Shortcuts added after a window built its keys (the add-on lookups
    // below answer later): build that window's keys again.
    reloadWindowKeys: function() {
        var windows = Services.wm.getEnumerator('navigator:browser');
        while (windows.hasMoreElements()) {
            let win = windows.getNext();
            if (win.ZutiloChrome && win.ZutiloChrome.zoteroOverlay &&
                    win.ZutiloChrome.zoteroOverlay.keyset) {
                win.ZutiloChrome.zoteroOverlay.reloadKeys();
            }
        }
    },

    alts: {},
    categories: {},
    shortcuts: {}
};

/********************************************/
// Define shortcuts
/********************************************/

/********************************************/
// Zutilo's Zotero item menu functions
/********************************************/
keys.categories.copyTags = 'copying'
keys.shortcuts.copyTags = function(win) {
    win.ZutiloChrome.zoteroOverlay.copyTags()
};
keys.categories.removeTags = 'itemediting'
keys.shortcuts.removeTags = function(win) {
    win.ZutiloChrome.zoteroOverlay.removeTags()
};
keys.categories.copyCreators = 'copying'
keys.shortcuts.copyCreators = function(win) {
    win.ZutiloChrome.zoteroOverlay.copyCreators()
};
keys.categories.pasteTags = 'itemediting'
keys.shortcuts.pasteTags = function(win) {
    win.ZutiloChrome.zoteroOverlay.pasteTags()
};
keys.categories.relateItems = 'itemediting'
keys.shortcuts.relateItems = function(win) {
    win.ZutiloChrome.zoteroOverlay.relateItems()
};
keys.categories.showAttachments = 'attachments'
keys.shortcuts.showAttachments = function(win) {
    win.ZutiloChrome.zoteroOverlay.showAttachments()
};
keys.categories.modifyAttachments = 'attachments'
keys.shortcuts.modifyAttachments = function(win) {
    win.ZutiloChrome.zoteroOverlay.modifyAttachments()
};
keys.categories.modifyURLAttachments = 'attachments'
keys.shortcuts.modifyURLAttachments = function(win) {
    win.ZutiloChrome.zoteroOverlay.modifyURLAttachments()
};
keys.categories.copyAttachmentPaths = 'attachments'
keys.shortcuts.copyAttachmentPaths = function(win) {
    win.ZutiloChrome.zoteroOverlay.copyAttachmentPaths()
};
keys.categories.copyItems = 'copying'
keys.shortcuts.copyItems = function(win) {
    win.ZutiloChrome.zoteroOverlay.copyItems()
};
keys.alts.copyItems_alt = {
    'category': 'copying',
    'generator': function(altNum) {
        return function(win) {
            win.ZutiloChrome.zoteroOverlay.copyItems_alt(altNum)
        }
    }
}
keys.categories.copyZoteroSelectLink = 'copying'
keys.shortcuts.copyZoteroSelectLink = function(win) {
    win.ZutiloChrome.zoteroOverlay.copyZoteroSelectLink()
};
keys.categories.copyZoteroPDFLink = 'copying'
keys.shortcuts.copyZoteroPDFLink = function(win) {
    win.ZutiloChrome.zoteroOverlay.copyZoteroPDFLink()
};
keys.categories.copyZoteroItemID = 'copying'
keys.shortcuts.copyZoteroItemID = function(win) {
    win.ZutiloChrome.zoteroOverlay.copyZoteroItemID()
};
keys.categories.copyZoteroItemURI = 'copying'
keys.shortcuts.copyZoteroItemURI = function(win) {
    win.ZutiloChrome.zoteroOverlay.copyZoteroItemURI()
};
keys.categories.openZoteroItemURI = 'other'
keys.shortcuts.openZoteroItemURI = function(win) {
    win.ZutiloChrome.zoteroOverlay.openZoteroItemURI()
};
keys.categories.createBookItem = 'itemcreation'
keys.shortcuts.createBookItem = function(win) {
    win.ZutiloChrome.zoteroOverlay.createBookItem()
};
keys.categories.createBookSection = 'itemcreation'
keys.shortcuts.createBookSection = function(win) {
    win.ZutiloChrome.zoteroOverlay.createBookSection()
};
keys.categories.copyChildIDs = 'itemediting'
keys.shortcuts.copyChildIDs = function(win) {
    win.ZutiloChrome.zoteroOverlay.copyChildIDs()
};
keys.categories.relocateChildren = 'itemediting'
keys.shortcuts.relocateChildren = function(win) {
    win.ZutiloChrome.zoteroOverlay.relocateChildren()
};
keys.categories.copyJSON = 'copying'
keys.shortcuts.copyJSON = function(win) {
    win.ZutiloChrome.zoteroOverlay.copyJSON()
}
keys.categories.pasteJSONIntoEmptyFields = 'itemediting'
keys.shortcuts.pasteJSONIntoEmptyFields = function(win) {
    win.ZutiloChrome.zoteroOverlay.pasteJSONIntoEmptyFields()
}
keys.categories.pasteJSONFromNonEmptyFields = 'itemediting'
keys.shortcuts.pasteJSONFromNonEmptyFields = function(win) {
    win.ZutiloChrome.zoteroOverlay.pasteJSONFromNonEmptyFields()
}
keys.categories.pasteJSONAll = 'itemediting'
keys.shortcuts.pasteJSONAll = function(win) {
    win.ZutiloChrome.zoteroOverlay.pasteJSONAll()
}
keys.categories.pasteJSONItemType = 'itemediting'
keys.shortcuts.pasteJSONItemType = function(win) {
    win.ZutiloChrome.zoteroOverlay.pasteJSONItemType()
}

/********************************************/
// Zutilo's Zotero collection menu functions
/********************************************/
keys.categories.copyZoteroCollectionSelectLink = 'copying'
keys.shortcuts.copyZoteroCollectionSelectLink = function(win) {
    win.ZutiloChrome.zoteroOverlay.copyZoteroCollectionSelectLink()
}
keys.categories.copyZoteroCollectionURI = 'copying'
keys.shortcuts.copyZoteroCollectionURI = function(win) {
    win.ZutiloChrome.zoteroOverlay.copyZoteroCollectionURI()
}

/***********************************************/
// Zutilo's Zotero item pane editing functions
/***********************************************/
keys.categories.itemInfo = 'uinavigation'
keys.shortcuts.itemInfo = function(win) {
    win.ZutiloChrome.zoteroOverlay.updatePaneVisibility('zotero-item', 'show');
    win.ZutiloChrome.zoteroOverlay.editItemInfoGUI();
};
keys.categories.addNote = 'uinavigation'
keys.shortcuts.addNote = function(win) {
    win.ZutiloChrome.zoteroOverlay.updatePaneVisibility('zotero-item', 'show');
    win.ZutiloChrome.zoteroOverlay.addNoteGUI();
};
keys.categories.addTag = 'uinavigation'
keys.shortcuts.addTag = function(win) {
    win.ZutiloChrome.zoteroOverlay.updatePaneVisibility('zotero-item', 'show');
    win.ZutiloChrome.zoteroOverlay.addTagGUI();
};
keys.categories.relateDialog = 'uinavigation'
keys.shortcuts.relateDialog = function(win) {
    win.ZutiloChrome.zoteroOverlay.updatePaneVisibility('zotero-item', 'show');
    win.ZutiloChrome.zoteroOverlay.addRelatedGUI();
};

/***********************************************/
// Zotero functions (i.e. not Zutilo functions)
// Item manipulation
/***********************************************/
keys.categories.newItemMenu = 'itemcreation'
keys.shortcuts.newItemMenu = function(win) {
    let button = keys.libraryElement(win, 'zotero-tb-add');
    button.firstChild.openPopup(button, 'after_start', 0, 0, false, false);
};
keys.categories.lookupID = 'itemcreation'
keys.shortcuts.lookupID = function(win) {
    // What the toolbar button and Zotero's own command do
    win.Zotero_Lookup.showPanel();
}
keys.categories.linked = 'itemcreation'
keys.shortcuts.linked = function(win) {
    win.ZoteroPane.addAttachmentFromDialog(true)
}
keys.categories.attachLinkFile = 'attachments'
keys.shortcuts.attachLinkFile = function(win) {
    var zitems = win.ZutiloChrome.zoteroOverlay.getSelectedItems('regular');
    var selectionOkay = win.ZutiloChrome.zoteroOverlay.
        checkItemNumber(zitems, 'regularSingle')
    if (!selectionOkay) {
        return false
    }

    win.ZoteroPane.addAttachmentFromDialog(true, zitems[0].id);
};
keys.categories.recognizeSelected = 'other'
keys.shortcuts.recognizeSelected = function(win) {
    // jscs: disable requireCamelCaseOrUpperCaseIdentifiers
    win.ZoteroPane_Local.recognizeSelected()
    // jscs: enable requireCamelCaseOrUpperCaseIdentifiers
};
keys.categories.createParentItemsFromSelected  = 'itemcreation'
keys.shortcuts.createParentItemsFromSelected  = function(win) {
    // jscs: disable requireCamelCaseOrUpperCaseIdentifiers
    win.ZoteroPane_Local.createParentItemsFromSelected()
    // jscs: enable requireCamelCaseOrUpperCaseIdentifiers
};
keys.categories.renameSelectedAttachmentsFromParents = 'attachments'
keys.shortcuts.renameSelectedAttachmentsFromParents = function(win) {
    // What the item pane's "Rename File to Match Parent Item" button calls
    // (renameFiles.mjs), for the selected attachment items.
    var { canRenameFileFromParent, renameFileFromParent } =
        ChromeUtils.importESModule('chrome://zotero/content/renameFiles.mjs');
    var attachments = win.ZoteroPane.getSelectedItems().
        filter((item) => item.isAttachment());
    (async function() {
        for (let attachment of attachments) {
            if (await canRenameFileFromParent(attachment)) {
                await renameFileFromParent(attachment);
            }
        }
    })().catch((err) => win.Zotero.logError(err));
};

keys.categories.findPDF = 'attachments'
keys.shortcuts.findPDF = function(win)
{
    // jscs: disable requireCamelCaseOrUpperCaseIdentifiers
    let items = win.ZoteroPane_Local.getSelectedItems();
    win.Zotero.Attachments.addAvailableFiles(items);
    // jscs: enable requireCamelCaseOrUpperCaseIdentifiers
};

keys.categories.attachURI = 'attachments'
keys.shortcuts.attachURI = function(win) {
    // jscs: disable requireCamelCaseOrUpperCaseIdentifiers
    var itemID = win.ZoteroPane_Local.getSelectedItems()[0].id
    win.ZoteroPane_Local.addAttachmentFromURI(true, itemID)
    // jscs: enable requireCamelCaseOrUpperCaseIdentifiers
}

keys.categories.attachStoredFile = 'attachments'
keys.shortcuts.attachStoredFile = function(win) {
    // jscs: disable requireCamelCaseOrUpperCaseIdentifiers
    var itemID = win.ZoteroPane_Local.getSelectedItems()[0].id
    win.ZoteroPane_Local.addAttachmentFromDialog(false, itemID)
    // jscs: enable requireCamelCaseOrUpperCaseIdentifiers
}

keys.categories.showFile = 'attachments'
keys.shortcuts.showFile = function(win) {
    let zitems = win.ZoteroPane.getSelectedItems()

    var _getBestFile = (async function (item) {
        if(item.isAttachment()) {
            if(item.attachmentLinkMode === win.Zotero.Attachments.LINK_MODE_LINKED_URL) return false;
            return item;
        } else {
            return await item.getBestAttachment();
        }
    });

    (async function (zitems){
        for (let item of zitems) {
            var attachment = await _getBestFile(item);
            if(attachment) {
                win.ZoteroPane_Local.showAttachmentInFilesystem(attachment.id);
            }
        }
    })(zitems)
}

/***********************************************/
// Zotero functions (i.e. not Zutilo functions)
// Focus selection
/***********************************************/
keys.categories.advancedSearch = 'uinavigation'
keys.shortcuts.advancedSearch = function(win) {
    // jscs: disable requireCamelCaseOrUpperCaseIdentifiers
    // Advanced search is part of the library view since Zotero 10
    // (openAdvancedSearchWindow() is a deprecated alias of this)
    win.ZoteroPane_Local.toggleAdvancedSearchState('open')
    // jscs: enable requireCamelCaseOrUpperCaseIdentifiers
};

keys.categories.duplicateItem = 'itemcreation'
keys.shortcuts.duplicateItem = function(win) {
    win.ZoteroPane.duplicateSelectedItem();
};

keys.categories.openRunJSWindow = 'uinavigation'
keys.shortcuts.openRunJSWindow = function(win) {
    win.openRunJSWindow();
}

keys.categories.openStyleEditor = 'uinavigation'
keys.shortcuts.openStyleEditor = function(win) {
    win.openStyleEditor();
}

keys.categories.generateReport = 'other'
keys.shortcuts.generateReport = function(win) {
    let context = win.ZoteroPane.document.defaultView
    if (context.document.activeElement.id == win.ZoteroPane.collectionsView.id) {
        context.Zotero_Report_Interface.loadCollectionReport()
    } else {
        // The items tree, whether it is the active element or not
        let zitems = win.ZoteroPane.getSelectedItems()
        if (zitems.length > 0) {
            context.Zotero_Report_Interface.loadItemReport()
        }
    }
};

keys.categories.focusZoteroCollectionsTree = 'uinavigation'
keys.shortcuts.focusZoteroCollectionsTree = function(win) {
    win.ZutiloChrome.zoteroOverlay.
        updatePaneVisibility('zotero-collections', 'show');
    win.ZoteroPane.collectionsView.focus();
};
keys.categories.focusZoteroItemsTree = 'uinavigation'
keys.shortcuts.focusZoteroItemsTree = function(win) {
    win.ZoteroPane.itemsView.focus();
};
keys.categories.advanceTabboxTab = 'uinavigation'
keys.shortcuts.advanceTabboxTab = function(win) {
    win.ZutiloChrome.zoteroOverlay.updatePaneVisibility('zotero-item', 'show');
    win.ZutiloChrome.zoteroOverlay.advanceItemPaneTab(1);
};
keys.categories.reverseTabboxTab = 'uinavigation'
keys.shortcuts.reverseTabboxTab = function(win) {
    win.ZutiloChrome.zoteroOverlay.updatePaneVisibility('zotero-item', 'show');
    win.ZutiloChrome.zoteroOverlay.advanceItemPaneTab(-1);
};
keys.categories.selectTabboxTab0 = 'uinavigation'
keys.shortcuts.selectTabboxTab0 = function(win) {
    win.ZutiloChrome.zoteroOverlay.updatePaneVisibility('zotero-item', 'show');
    win.ZutiloChrome.zoteroOverlay.selectItemPaneTab(0);
};
keys.categories.selectTabboxTab1 = 'uinavigation'
keys.shortcuts.selectTabboxTab1 = function(win) {
    win.ZutiloChrome.zoteroOverlay.updatePaneVisibility('zotero-item', 'show');
    win.ZutiloChrome.zoteroOverlay.selectItemPaneTab(1);
};
keys.categories.selectTabboxTab2 = 'uinavigation'
keys.shortcuts.selectTabboxTab2 = function(win) {
    win.ZutiloChrome.zoteroOverlay.updatePaneVisibility('zotero-item', 'show');
    win.ZutiloChrome.zoteroOverlay.selectItemPaneTab(2);
};
keys.categories.selectTabboxTab3 = 'uinavigation'
keys.shortcuts.selectTabboxTab3 = function(win) {
    win.ZutiloChrome.zoteroOverlay.updatePaneVisibility('zotero-item', 'show');
    win.ZutiloChrome.zoteroOverlay.selectItemPaneTab(3);
};

keys.categories.locateMenu = 'uinavigation'
keys.shortcuts.locateMenu = function(win) {
    // The Locate button at the bottom of the item pane's side bar. It
    // builds its menu and opens it on a mouse press.
    let itemPane = win.ZoteroPane.itemPane;
    let button = itemPane && itemPane.querySelector
        ? itemPane.querySelector('toolbarbutton[data-action="locate"]') : null;
    if (!button) {
        button = win.document.querySelector(
            'item-pane-sidenav toolbarbutton[data-action="locate"]');
    }
    if (!button || button.open) {
        return;
    }
    button.dispatchEvent(new win.MouseEvent(
        'mousedown', {button: 0, bubbles: true, cancelable: true}));
};

keys.categories.locateItem = 'uinavigation'
keys.shortcuts.locateItem = function(win) {
    let label = Zutilo.Prefs.get("locateItemEngine")
    // Zotero renamed its "Google Scholar Search" engine to "Google Scholar"
    // (Zutilo's default until 4.3): follow it, as Zotero does for its users
    if (label == 'Google Scholar Search' && win.Zotero.LocateManager &&
            !win.Zotero.LocateManager.getEngineByName(label)) {
        label = 'Google Scholar'
    }
    win.Zotero_LocateMenu.locateItem({"target": {"label": label}})
};

keys.categories.toggleAutomaticTags  = 'uinavigation'
keys.shortcuts.toggleAutomaticTags = function(win) {
    win.ZoteroPane.tagSelector.toggleShowAutomatic()
};

keys.categories.toggleAllTags = 'uinavigation'
keys.shortcuts.toggleAllTags = function(win) {
    win.ZoteroPane.tagSelector.toggleDisplayAllTags()
};

keys.categories.deselectTags = 'uinavigation'
keys.shortcuts.deselectTags = function(win) {
    win.ZoteroPane.tagSelector.deselectAll()
};

keys.categories.focusTagSelector = 'uinavigation'
keys.shortcuts.focusTagSelector = function(win) {
    win.ZoteroPane.tagSelector.searchBoxRef.current.focus()
};

/***********************************************/
// Zotero functions (i.e. not Zutilo functions)
// Hide/show left/right pane
/***********************************************/
keys.categories.toggleZoteroCollectionsPane = 'uinavigation'
keys.shortcuts.toggleZoteroCollectionsPane = function(win) {
    win.ZutiloChrome.zoteroOverlay.updatePaneVisibility('zotero-collections',
                                                        'toggle')
};

keys.categories.toggleZoteroItemPane = 'uinavigation'
keys.shortcuts.toggleZoteroItemPane = function(win) {
    win.ZutiloChrome.zoteroOverlay.updatePaneVisibility('zotero-item', 'toggle')
};

keys.categories.toggleZoteroCollectionsPaneStickySplitter = 'uinavigation'
keys.shortcuts.toggleZoteroCollectionsPaneStickySplitter = function(win) {
    win.ZutiloChrome.zoteroOverlay.updatePaneVisibility('zotero-collections',
                                                        'toggle', true)
};

keys.categories.toggleZoteroItemPaneStickySplitter = 'uinavigation'
keys.shortcuts.toggleZoteroItemPaneStickySplitter = function(win) {
    win.ZutiloChrome.zoteroOverlay.updatePaneVisibility('zotero-item',
                                                        'toggle', true)
};

AddonManager.getAddonByID('better-bibtex@iris-advies.com').then(function(aAddon) {
    if (!aAddon || !aAddon.isActive) {
        return
    }

    keys.categories.BBTRefresh = 'bbt'
    keys.shortcuts.BBTRefresh = function(win) {
        win.Zotero.BetterBibTeX.ready.then(function() {
            let keyManager = win.Zotero.BetterBibTeX.KeyManager
            if (keyManager.refresh) {
                keyManager.refresh('selected', true)
            } else {
                // Better BibTeX 9: what its own "Regenerate BibTeX key"
                // item menu entry calls
                keyManager.fill('selected', {warn: true, replace: true})
            }
        }).catch((err) => win.Zotero.logError(err))
    }

    keys.categories.BBTtoTeXstudio = 'bbt'
    keys.shortcuts.BBTtoTeXstudio = function(win) {
        win.Zotero.BetterBibTeX.ready.then(function() {
            let bbt = win.Zotero.BetterBibTeX
            if (bbt.ZoteroPane && bbt.ZoteroPane.toTeXstudio) {
                bbt.ZoteroPane.toTeXstudio()
            } else {
                // Better BibTeX 9: what its own "Push to TeXstudio" item
                // menu entry calls
                bbt.MenuHelper.toTeXstudio()
            }
        }).catch((err) => win.Zotero.logError(err))
    }
    // Call setDefaults again so it generates defaults for these shortcuts
    // created in the getAddonByID callback.
    // TODO: Only add defaults for the shortcuts generated here.
    Zutilo.Prefs.setDefaults()
    keys.reloadWindowKeys()
}).catch((err) => Components.utils.reportError(err))

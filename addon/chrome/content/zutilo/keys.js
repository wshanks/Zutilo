/* Copyright 2012 Will Shanks.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';
/* global Components, AddonManager, Services */
/* global Zotero */
/* global Zutilo, gKeys */

/********************************************/
// Include core modules and built-in modules
/********************************************/
Components.utils.import('resource://gre/modules/AddonManager.jsm');
Components.utils.import('resource://gre/modules/Services.jsm');
Components.utils.import('chrome://zutilo/content/zutilo.js');

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

    keysEqual: function(key1, key2) {
        var keyEquality =
            (key1.modifiers == key2.modifiers && key1.key == key2.key &&
             key1.keycode == key2.keycode);
        return keyEquality
    },

    getLabels: function() {
        for (var shortcut in Zutilo.keys.shortcuts) {
            gKeys.push(shortcut)
        }
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
// tab utilities
keys.categories.load_tabs_from_selected_item = 'attachments'
keys.shortcuts.load_tabs_from_selected_item = function(win) {
    win.ZutiloChrome.zoteroOverlay.load_tabs_from_selected_item()
};
keys.categories.save_tabs_to_selected_item = 'itemediting'
keys.shortcuts.save_tabs_to_selected_item = function(win) {
    win.ZutiloChrome.zoteroOverlay.save_tabs_to_selected_item()
};
keys.categories.save_tabs_to_selected_collection = 'other'
keys.shortcuts.save_tabs_to_selected_collection = function(win) {
    win.ZutiloChrome.zoteroOverlay.save_tabs_to_selected_collection()
};
keys.categories.copyZoteroSelectPDFLink = 'copying'
keys.shortcuts.copyZoteroSelectPDFLink = function(win) {
    win.ZutiloChrome.zoteroOverlay.copyZoteroSelectPDFLink()
};
keys.categories.copyZoteroSelectMDLink = 'copying'
keys.shortcuts.copyZoteroSelectMDLink = function(win) {
    win.ZutiloChrome.zoteroOverlay.copyZoteroSelectMDLink()
};
keys.categories.copyZoteroSelectLink = 'copying'
keys.shortcuts.copyZoteroSelectLink = function(win) {
    win.ZutiloChrome.zoteroOverlay.copyZoteroSelectLink()
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
    win.document.getElementById('zotero-tb-add').firstChild.showPopup();
};
keys.categories.lookupID = 'itemcreation'
keys.shortcuts.lookupID = function(win) {
    win.document.getElementById('zotero-lookup-panel').showPopup()
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
    // jscs: disable requireCamelCaseOrUpperCaseIdentifiers
    win.ZoteroPane_Local.renameSelectedAttachmentsFromParents()
    // jscs: enable requireCamelCaseOrUpperCaseIdentifiers
};

keys.categories.findPDF = 'attachments'
keys.shortcuts.findPDF = function(win)
{
    // jscs: disable requireCamelCaseOrUpperCaseIdentifiers
    let items = win.ZoteroPane_Local.getSelectedItems();
    win.Zotero.Attachments.addAvailablePDFs(items);
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

    var _getBestFile = win.Zotero.Promise.coroutine(function* (item) {
        if(item.isAttachment()) {
            if(item.attachmentLinkMode === win.Zotero.Attachments.LINK_MODE_LINKED_URL) return false;
            return item;
        } else {
            return yield item.getBestAttachment();
        }
    });

    win.Zotero.Promise.coroutine(function* (zitems){
        for (let item of zitems) {
            var attachment = yield _getBestFile(item);
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
    win.ZoteroPane_Local.openAdvancedSearchWindow()
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
    // Zotero >=6
    if (context.document.activeElement.id == win.ZoteroPane.collectionsView.id
            // Zotero <=5
            || context.document.activeElement.id == "zotero-collections-tree") {
        context.Zotero_Report_Interface.loadCollectionReport()
    } else {
        // "zotero-items-tree" whether it is the active element or not
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
    // Zotero >=6
    if (win.ZoteroPane.collectionsView.focus) {
        win.ZoteroPane.collectionsView.focus();
    }
    // Zotero 5.0.97-beta.39
    else if (win.document.getElementById('collection-tree')) {
        win.document.getElementById('collection-tree').focus();
    }
    // Zotero <=5
    else {
        win.document.getElementById('zotero-collections-tree').focus();
    }
};
keys.categories.focusZoteroItemsTree = 'uinavigation'
keys.shortcuts.focusZoteroItemsTree = function(win) {
    // Zotero >=6
    if (win.ZoteroPane.itemsView.focus) {
        win.ZoteroPane.itemsView.focus();
    }
    // Zotero 5.0.97-beta.39
    else if (win.ZoteroPane.itemsView.tree && win.ZoteroPane.itemsView.tree.focus) {
        win.ZoteroPane.itemsView.tree.focus();
    }
    // Zotero <=5
    else {
        win.document.getElementById('zotero-items-tree').focus();
    }
};
keys.categories.advanceTabboxTab = 'uinavigation'
keys.shortcuts.advanceTabboxTab = function(win) {
    win.ZutiloChrome.zoteroOverlay.updatePaneVisibility('zotero-item', 'show');
    win.document.getElementById('zotero-view-tabbox').
        tabs.advanceSelectedTab(1, true);
};
keys.categories.reverseTabboxTab = 'uinavigation'
keys.shortcuts.reverseTabboxTab = function(win) {
    win.ZutiloChrome.zoteroOverlay.updatePaneVisibility('zotero-item', 'show');
    win.document.getElementById('zotero-view-tabbox').
        tabs.advanceSelectedTab(-1, true);
};
keys.categories.selectTabboxTab0 = 'uinavigation'
keys.shortcuts.selectTabboxTab0 = function(win) {
    win.ZutiloChrome.zoteroOverlay.updatePaneVisibility('zotero-item', 'show');
    win.document.getElementById('zotero-view-tabbox').tabs.selectedIndex = 0;
};
keys.categories.selectTabboxTab1 = 'uinavigation'
keys.shortcuts.selectTabboxTab1 = function(win) {
    win.ZutiloChrome.zoteroOverlay.updatePaneVisibility('zotero-item', 'show');
    win.document.getElementById('zotero-view-tabbox').tabs.selectedIndex = 1;
};
keys.categories.selectTabboxTab2 = 'uinavigation'
keys.shortcuts.selectTabboxTab2 = function(win) {
    win.ZutiloChrome.zoteroOverlay.updatePaneVisibility('zotero-item', 'show');
    win.document.getElementById('zotero-view-tabbox').tabs.selectedIndex = 2;
};
keys.categories.selectTabboxTab3 = 'uinavigation'
keys.shortcuts.selectTabboxTab3 = function(win) {
    win.ZutiloChrome.zoteroOverlay.updatePaneVisibility('zotero-item', 'show');
    win.document.getElementById('zotero-view-tabbox').tabs.selectedIndex = 3;
};

keys.categories.locateMenu = 'uinavigation'
keys.shortcuts.locateMenu = function(win) {
    win.document.getElementById('zotero-tb-locate-menu').showPopup();
};

keys.categories.locateItem = 'uinavigation'
keys.shortcuts.locateItem = function(win) {
    let label = Zutilo.Prefs.get("locateItemEngine")
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

AddonManager.getAddonByID('better-bibtex@iris-advies.com', function(aAddon) {
    if (aAddon === null || !aAddon.isActive) {
        return
    }

    keys.categories.BBTPin = 'bbt'
    keys.shortcuts.BBTPin = function(win) {
        win.Zotero.BetterBibTeX.ready.then(
            function() {win.Zotero.BetterBibTeX.KeyManager.pin('selected')})
    }

    keys.categories.BBTUnpin = 'bbt'
    keys.shortcuts.BBTUnpin = function(win) {
        win.Zotero.BetterBibTeX.ready.then(function() {
            win.Zotero.BetterBibTeX.KeyManager.unpin('selected')})
    }

    keys.categories.BBTRefresh = 'bbt'
    keys.shortcuts.BBTRefresh = function(win) {
        win.Zotero.BetterBibTeX.ready.then(function() {
            win.Zotero.BetterBibTeX.KeyManager.refresh('selected', true)})
    }

    keys.categories.BBTtoTeXstudio = 'bbt'
    keys.shortcuts.BBTtoTeXstudio = function(win) {
        win.Zotero.BetterBibTeX.ready.then(function() {
            win.Zotero.BetterBibTeX.ZoteroPane.toTeXstudio()})
    }
    // Call setDefaults again so it generates defaults for these shortcuts
    // created in the getAddonByID callback.
    // TODO: Only add defaults for the shortcuts generated here.
    Zutilo.Prefs.setDefaults()
})

AddonManager.getAddonByID('zotfile@columbia.edu', function(aAddon) {
    if (aAddon === null || !aAddon.isActive) {
        return
    }

    keys.categories.ZotFileAttach = 'ZotFile'
    keys.shortcuts.ZotFileAttach = function(win) {
        win.Zotero.ZotFile.attachFileFromSourceDirectory()
    }

    keys.categories.ZotFileRename = 'ZotFile'
    keys.shortcuts.ZotFileRename = function(win) {
        win.Zotero.ZotFile.renameSelectedAttachments()
    }

    keys.categories.ZotFileExtractAnnotations = 'ZotFile'
    keys.shortcuts.ZotFileExtractAnnotations = function(win) {
        win.Zotero.ZotFile.pdfAnnotations.getAnnotations()
    }

    Zutilo.Prefs.setDefaults()
})

AddonManager.getAddonByID('mdnotes@mdnotes.github.io', function (aAddon) {
    if (aAddon === null || !aAddon.isActive) {
        return
    }
    
    keys.categories.MdnotesBatchExport = 'mdnotes'
    keys.shortcuts.MdnotesBatchExport = function(win) {
        win.Zotero.Mdnotes.batchExportMenu()
    }

    keys.categories.MdnotesExport = 'mdnotes'
    keys.shortcuts.MdnotesExport = function(win) {
        win.Zotero.Mdnotes.exportToMarkdownMenu()
    }

    keys.categories.MdnotesCreateStandaloneNote = 'mdnotes'
    keys.shortcuts.MdnotesCreateStandaloneNote = function(win) {
        win.Zotero.Mdnotes.createNoteFileMenu(true)
    }

    keys.categories.MdnotesCreateMdNote = 'mdnotes'
    keys.shortcuts.MdnotesCreateMdNote = function(win) {
        win.Zotero.Mdnotes.createNoteFileMenu(false)
    }
    Zutilo.Prefs.setDefaults()
})
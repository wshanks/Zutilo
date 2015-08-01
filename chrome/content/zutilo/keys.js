/* Copyright 2012 Will Shanks.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';
/* global gBrowser, window, document, Components */
/* global Zotero, ZoteroPane, Zotero_Browser */
/* global Zutilo, ZutiloChrome, gKeys */

/********************************************/
// Include core modules and built-in modules
/********************************************/
Components.utils.import('resource://gre/modules/AddonManager.jsm');
Components.utils.import('resource://gre/modules/Services.jsm');
Components.utils.import('chrome://zutilo/content/zutilo.jsm');

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
        var name = Zutilo._bundle.GetStringFromName('zutilo.shortcuts.name.' +
                                                    keyLabel)
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
        var labels = [];

        for (var shortcut in Zutilo.keys.shortcuts) {
            gKeys.push(shortcut)
        }
    },

    shortcuts: {}
};

/********************************************/
// Define shortcuts
/********************************************/

/********************************************/
// Zutilo's Zotero item menu functions
/********************************************/
keys.shortcuts.copyTags = function(win) {
    win.ZutiloChrome.zoteroOverlay.copyTags()
};
keys.shortcuts.removeTags = function(win) {
    win.ZutiloChrome.zoteroOverlay.removeTags()
};
keys.shortcuts.copyCreators = function(win) {
    win.ZutiloChrome.zoteroOverlay.copyCreators()
};
keys.shortcuts.pasteTags = function(win) {
    win.ZutiloChrome.zoteroOverlay.pasteTags()
};
keys.shortcuts.relateItems = function(win) {
    win.ZutiloChrome.zoteroOverlay.relateItems()
};
keys.shortcuts.showAttachments = function(win) {
    win.ZutiloChrome.zoteroOverlay.showAttachments()
};
keys.shortcuts.modifyAttachments = function(win) {
    win.ZutiloChrome.zoteroOverlay.modifyAttachments()
};
keys.shortcuts.copyItems = function(win) {
    win.ZutiloChrome.zoteroOverlay.copyItems()
};
keys.shortcuts.copyZoteroSelectLink = function(win) {
    win.ZutiloChrome.zoteroOverlay.copyZoteroSelectLink()
};
keys.shortcuts.copyZoteroItemURI = function(win) {
    win.ZutiloChrome.zoteroOverlay.copyZoteroItemURI()
};
keys.shortcuts.createBookItem = function(win) {
    win.ZutiloChrome.zoteroOverlay.createBookItem()
};
keys.shortcuts.createBookSection = function(win) {
    win.ZutiloChrome.zoteroOverlay.createBookSection()
};
keys.shortcuts.copyChildIDs = function(win) {
    win.ZutiloChrome.zoteroOverlay.copyChildIDs()
};
keys.shortcuts.relocateChildren = function(win) {
    win.ZutiloChrome.zoteroOverlay.relocateChildren()
};

/***********************************************/
// Zutilo's Zotero item pane editing functions
/***********************************************/
keys.shortcuts.itemInfo = function(win) {
    win.ZutiloChrome.zoteroOverlay.updatePaneVisibility('zotero-item', 'show');
    win.ZutiloChrome.zoteroOverlay.editItemInfoGUI();
};
keys.shortcuts.addNote = function(win) {
    win.ZutiloChrome.zoteroOverlay.updatePaneVisibility('zotero-item', 'show');
    win.ZutiloChrome.zoteroOverlay.addNoteGUI();
};
keys.shortcuts.addTag = function(win) {
    win.ZutiloChrome.zoteroOverlay.updatePaneVisibility('zotero-item', 'show');
    win.ZutiloChrome.zoteroOverlay.addTagGUI();
};
keys.shortcuts.relateDialog = function(win) {
    win.ZutiloChrome.zoteroOverlay.updatePaneVisibility('zotero-item', 'show');
    win.ZutiloChrome.zoteroOverlay.addRelatedGUI();
};

/***********************************************/
// Zotero functions (i.e. not Zutilo functions)
// Item manipulation
/***********************************************/
keys.shortcuts.newItemMenu = function(win) {
    win.document.getElementById('zotero-tb-add').firstChild.showPopup();
};
keys.shortcuts.attachLinkFile = function(win) {
    var zitems = win.ZutiloChrome.zoteroOverlay.getSelectedItems('regular');
    var selectionOkay = win.ZutiloChrome.zoteroOverlay.
        checkItemNumber(zitems, 'regularSingle')
    if (!selectionOkay) {
        return false
    }

    win.ZoteroPane.addAttachmentFromDialog(true, zitems[0].id);
};
keys.shortcuts.recognizeSelected = function(win) {
    // jscs: disable requireCamelCaseOrUpperCaseIdentifiers
    win.Zotero_RecognizePDF.recognizeSelected()
    // jscs: enable requireCamelCaseOrUpperCaseIdentifiers
};
keys.shortcuts.createParentItemsFromSelected  = function(win) {
    // jscs: disable requireCamelCaseOrUpperCaseIdentifiers
    win.ZoteroPane_Local.createParentItemsFromSelected()
    // jscs: enable requireCamelCaseOrUpperCaseIdentifiers
};
keys.shortcuts.renameSelectedAttachmentsFromParents  = function(win) {
    // jscs: disable requireCamelCaseOrUpperCaseIdentifiers
    win.ZoteroPane_Local.renameSelectedAttachmentsFromParents()
    // jscs: enable requireCamelCaseOrUpperCaseIdentifiers
};

/***********************************************/
// Zotero functions (i.e. not Zutilo functions)
// Focus selection
/***********************************************/
keys.shortcuts.duplicateItem = function(win) {
    win.ZoteroPane.duplicateSelectedItem();
};

keys.shortcuts.generateReport = function(win) {
    if (win.document.activeElement.id == "zotero-collections-tree") {
            win.Zotero_Report_Interface.loadCollectionReport()
    } else {
        // "zotero-items-tree" whether it is the active element or not
		let zitems = win.ZoteroPane.getSelectedItems()
		if (zitems.length > 0) {
			win.Zotero_Report_Interface.loadItemReport()
		}
    }
};

keys.shortcuts.focusZoteroCollectionsTree = function(win) {
    win.ZutiloChrome.zoteroOverlay.
        updatePaneVisibility('zotero-collections', 'show');
    win.document.getElementById('zotero-collections-tree').focus();
};
keys.shortcuts.focusZoteroItemsTree = function(win) {
    win.document.getElementById('zotero-items-tree').focus();
};
keys.shortcuts.advanceTabboxTab = function(win) {
    win.ZutiloChrome.zoteroOverlay.updatePaneVisibility('zotero-item', 'show');
    win.document.getElementById('zotero-view-tabbox').
        tabs.advanceSelectedTab(1, true);
};
keys.shortcuts.reverseTabboxTab = function(win) {
    win.ZutiloChrome.zoteroOverlay.updatePaneVisibility('zotero-item', 'show');
    win.document.getElementById('zotero-view-tabbox').
        tabs.advanceSelectedTab(-1, true);
};
keys.shortcuts.selectTabboxTab0 = function(win) {
    win.ZutiloChrome.zoteroOverlay.updatePaneVisibility('zotero-item', 'show');
    win.document.getElementById('zotero-view-tabbox').tabs.selectedIndex = 0;
};
keys.shortcuts.selectTabboxTab1 = function(win) {
    win.ZutiloChrome.zoteroOverlay.updatePaneVisibility('zotero-item', 'show');
    win.document.getElementById('zotero-view-tabbox').tabs.selectedIndex = 1;
};
keys.shortcuts.selectTabboxTab2 = function(win) {
    win.ZutiloChrome.zoteroOverlay.updatePaneVisibility('zotero-item', 'show');
    win.document.getElementById('zotero-view-tabbox').tabs.selectedIndex = 2;
};
keys.shortcuts.selectTabboxTab3 = function(win) {
    win.ZutiloChrome.zoteroOverlay.updatePaneVisibility('zotero-item', 'show');
    win.document.getElementById('zotero-view-tabbox').tabs.selectedIndex = 3;
};

/***********************************************/
// Zotero functions (i.e. not Zutilo functions)
// Hide/show left/right pane
/***********************************************/
keys.shortcuts.toggleZoteroCollectionsPane = function(win) {
    win.ZutiloChrome.zoteroOverlay.updatePaneVisibility('zotero-collections',
                                                        'toggle')
};

keys.shortcuts.toggleZoteroItemPane = function(win) {
    win.ZutiloChrome.zoteroOverlay.updatePaneVisibility('zotero-item', 'toggle')
};

keys.shortcuts.toggleZoteroCollectionsPaneStickySplitter = function(win) {
    win.ZutiloChrome.zoteroOverlay.updatePaneVisibility('zotero-collections',
                                                        'toggle', true)
};

keys.shortcuts.toggleZoteroItemPaneStickySplitter = function(win) {
    win.ZutiloChrome.zoteroOverlay.updatePaneVisibility('zotero-item',
                                                        'toggle', true)
};

/********************************************/
// Firefox only shortcuts
/********************************************/
if (Zutilo.appName == 'Firefox') {

    /********************************************/
    // Zutilo's Firefox scraping functions
    /********************************************/
    keys.shortcuts.attachPage = function(win) {
        win.ZutiloChrome.firefoxOverlay.attachURLToCurrentItem(
            win.content.location.href)
    };

    keys.shortcuts.saveItemZutilo = function(win) {
        win.ZutiloChrome.firefoxOverlay.scrapeThisPage()
    };

    keys.shortcuts.saveItemWithAttachments = function(win) {
        win.ZutiloChrome.firefoxOverlay.scrapeThisPage(false, true)
    };

    keys.shortcuts.saveItemWithoutAttachments = function(win) {
        win.ZutiloChrome.firefoxOverlay.scrapeThisPage(false, false)
    };

    /***********************************************/
    // Zotero functions (i.e. not Zutilo functions)
    /***********************************************/
    keys.shortcuts.toggleZotero = function(win) {
        win.ZoteroOverlay.toggleDisplay()
    };

    keys.shortcuts.focusZotero = function(win) {
        win.ZoteroOverlay.toggleDisplay(true)
    };

    keys.shortcuts.hideZotero = function(win) {
        win.ZoteroOverlay.toggleDisplay(false)
    };

    keys.shortcuts.saveItemZotero = function(win) {
        // jscs: disable requireCamelCaseOrUpperCaseIdentifiers
        win.Zotero_Browser.scrapeThisPage()
        // jscs: enable requireCamelCaseOrUpperCaseIdentifiers
    };

    keys.shortcuts.websiteItem = function(win) {
        win.ZoteroPane.addItemFromPage()
    };

}

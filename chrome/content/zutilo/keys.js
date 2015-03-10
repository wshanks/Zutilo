/* Copyright 2012 Will Shanks.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
 
"use strict";
//////////////////////////////////////////////
// Include core modules and built-in modules
//////////////////////////////////////////////
Components.utils.import("resource://gre/modules/AddonManager.jsm");
Components.utils.import("resource://gre/modules/Services.jsm");
Components.utils.import("chrome://zutilo/content/zutilo.jsm");

//////////////////////////////////////////////
// Define keys object
//////////////////////////////////////////////
var keys = {
	getKey: function(keyLabel) {
		return JSON.parse(Zutilo.Prefs.get('shortcut.' + keyLabel))
	},

	setKey: function(keyLabel, key) {
		Zutilo.Prefs.set('shortcut.' + keyLabel, JSON.stringify(key))
	},

	keyName: function(keyLabel) {
		return Zutilo._bundle.GetStringFromName("zutilo.shortcuts.name." + keyLabel);
	},
	
	keyID: function(keyLabel) {
		return 'zutilo-key-' + keyLabel
	},
	
	keysEqual: function(key1, key2) {
		var keyEquality = 
			(key1.modifiers == key2.modifiers 
			&& key1.key == key2.key 
			&& key1.keycode == key2.keycode);
		return keyEquality
	},
	
	getLabels: function() {
		var labels = [];
		
		for (var shortcut in Zutilo.keys.shortcuts) {
			gKeys.push(shortcut);
		}
	},
	
	shortcuts: new Object()
};

//////////////////////////////////////////////
// Define shortcuts
//////////////////////////////////////////////

///////////////////////////////////////////////////////////
// Zutilo's Zotero item menu functions
///////////////////////////////////////////////////////////
keys.shortcuts["copyTags"] = function(win) {
	win.ZutiloChrome.zoteroOverlay.copyTags();
};
keys.shortcuts["copyCreators"] = function(win) {
	win.ZutiloChrome.zoteroOverlay.copyCreators();
};
keys.shortcuts["pasteTags"] = function(win) {
	win.ZutiloChrome.zoteroOverlay.pasteTags();
};
keys.shortcuts["relateItems"] = function(win) {
	win.ZutiloChrome.zoteroOverlay.relateItems();
};
keys.shortcuts["showAttachments"] = function(win) {
	win.ZutiloChrome.zoteroOverlay.showAttachments();
};
keys.shortcuts["modifyAttachments"] = function(win) {
	win.ZutiloChrome.zoteroOverlay.modifyAttachments();
};
keys.shortcuts["copyItems"] = function(win) {
	win.ZutiloChrome.zoteroOverlay.copyItems();
};
keys.shortcuts["copyZoteroSelectLink"] = function(win) {
	win.ZutiloChrome.zoteroOverlay.copyZoteroSelectLink();
};
keys.shortcuts["copyZoteroItemURI"] = function(win) {
	win.ZutiloChrome.zoteroOverlay.copyZoteroItemURI();
};
	
///////////////////////////////////////////////////////////
// Zutilo's Zotero item pane editing functions
///////////////////////////////////////////////////////////
keys.shortcuts["itemInfo"] = function(win) {
	win.ZutiloChrome.zoteroOverlay.editItemInfoGUI();
};
keys.shortcuts["addNote"] = function(win) {
	win.ZutiloChrome.zoteroOverlay.addNoteGUI();
};
keys.shortcuts["addTag"] = function(win) {
	win.ZutiloChrome.zoteroOverlay.addTagGUI();
};
keys.shortcuts["relateDialog"] = function(win) {
	win.ZutiloChrome.zoteroOverlay.addRelatedGUI();
};

///////////////////////////////////////////////////////////
// Zotero functions (i.e. not Zutilo functions)
// Item manipulation
///////////////////////////////////////////////////////////
keys.shortcuts["newItemMenu"] = function(win) {
	win.document.getElementById("zotero-tb-add").firstChild.showPopup()
};
keys.shortcuts["attachLinkFile"] = function(win) {
	var zitems = win.ZutiloChrome.zoteroOverlay.getSelectedItems('regular');
	if (!win.ZutiloChrome.zoteroOverlay.checkItemNumber(zitems,'regularSingle')) {
		return false;
	}
	
	win.ZoteroPane.addAttachmentFromDialog(true, zitems[0].id);
};
keys.shortcuts["recognizeSelected"] = function(win) {
    win.Zotero_RecognizePDF.recognizeSelected() ;
};
keys.shortcuts["createParentItemsFromSelected"]  = function(win) {
    win.ZoteroPane_Local.createParentItemsFromSelected(); 
};
keys.shortcuts["renameSelectedAttachmentsFromParents"]  = function(win) {
    win.ZoteroPane_Local.renameSelectedAttachmentsFromParents();
};

///////////////////////////////////////////////////////////
// Zotero functions (i.e. not Zutilo functions
// Focus selection
///////////////////////////////////////////////////////////
keys.shortcuts["duplicateItem"] = function(win) {
	win.ZoteroPane.duplicateSelectedItem();
};
	
keys.shortcuts["focusZoteroCollectionsTree"] = function(win) {
    win.document.getElementById("zotero-collections-tree").focus();
};
keys.shortcuts["focusZoteroItemsTree"] = function(win) {
    win.document.getElementById('zotero-items-tree').focus();
};
keys.shortcuts["advanceTabboxTab"] = function(win) {
    win.document.getElementById('zotero-view-tabbox').tabs.advanceSelectedTab(1,true); 
};
keys.shortcuts["reverseTabboxTab"] = function(win) {
    win.document.getElementById('zotero-view-tabbox').tabs.advanceSelectedTab(-1,true); 
};
keys.shortcuts["selectTabboxTab0"] = function(win) {
    win.document.getElementById('zotero-view-tabbox').tabs.selectedIndex = 0
};
keys.shortcuts["selectTabboxTab1"] = function(win) {
    win.document.getElementById('zotero-view-tabbox').tabs.selectedIndex = 1
};
keys.shortcuts["selectTabboxTab2"] = function(win) {
    win.document.getElementById('zotero-view-tabbox').tabs.selectedIndex = 2
};
keys.shortcuts["selectTabboxTab3"] = function(win) {
    win.document.getElementById('zotero-view-tabbox').tabs.selectedIndex = 3
};

///////////////////////////////////////////////////////////
// Firefox only shortcuts
///////////////////////////////////////////////////////////
if (Zutilo.appName == 'Firefox') {

	///////////////////////////////////////////////////////////
	// Zutilo's Firefox scraping functions
	///////////////////////////////////////////////////////////
	keys.shortcuts["attachPage"] = function(win) {
		win.ZutiloChrome.firefoxOverlay.attachURLToCurrentItem(
			win.content.location.href);
	};
	
	keys.shortcuts["saveItemZutilo"] = function(win) {
		win.ZutiloChrome.firefoxOverlay.scrapeThisPage()
	};
	
	keys.shortcuts["saveItemWithAttachments"] = function(win) {
		win.ZutiloChrome.firefoxOverlay.scrapeThisPage(false, true);
	};

	keys.shortcuts["saveItemWithoutAttachments"] = function(win) {
		win.ZutiloChrome.firefoxOverlay.scrapeThisPage(false, false);
	};

	///////////////////////////////////////////////////////////
	// Zotero functions (i.e. not Zutilo functions)
	///////////////////////////////////////////////////////////
	keys.shortcuts["toggleZotero"] = function(win) {
		win.ZoteroOverlay.toggleDisplay()
	};
	
	keys.shortcuts["focusZotero"] = function(win) {
		win.ZoteroOverlay.toggleDisplay(true);
	};
	
	keys.shortcuts["hideZotero"] = function(win) {
		win.ZoteroOverlay.toggleDisplay(false);
	};
	
	keys.shortcuts["saveItemZotero"] = function(win) {
		win.Zotero_Browser.scrapeThisPage()
	};
	
	keys.shortcuts["websiteItem"] = function(win) {
		win.ZoteroPane.addItemFromPage()
	};

}

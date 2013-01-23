/* Copyright 2012 Will Shanks.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";
Components.utils.import("resource://gre/modules/Services.jsm");
Components.utils.import("chrome://zutilo/content/zutilo.jsm");
 
 /**
 * ZutiloChrome namespace.
 */
if ("undefined" == typeof(ZutiloChrome)) {
  window.ZutiloChrome = {};
};

ZutiloChrome.zoteroOverlay = {
	///////////////////////////////////////////
	// Window load handling
	///////////////////////////////////////////
	init: function() {
		this.itemmenuPrefObserver.register();
		
		this.staticOverlay();
		this.zoteroItemPopup();
		
		window.setTimeout(function() { ZutiloChrome.showUpgradeMessage(); }, 500);
	},
	
	///////////////////////////////////////////
	// Functions for GUI keyboard shortcuts
	///////////////////////////////////////////	
	editItemInfoGUI: function() {
		var zitems = this.getSelectedItems('regular');
		if (!this.checkItemNumber(zitems,'regularSingle')) {
			return false;
		}
		
		//Select info tab of item pane
		var tabIndex = 0;
		var zoteroViewTabbox = 
			ZoteroPane.document.getElementById("zotero-view-tabbox");
		zoteroViewTabbox.selectedIndex = tabIndex;
		//Focus first entry textbox of info pane
		ZoteroPane.document.getElementById("zotero-editpane-item-box").
			focusFirstField('info');
		
		return true;
	},
		
	addNoteGUI: function() {
		var zitems = this.getSelectedItems('regular');
		if (!this.checkItemNumber(zitems,'regularSingle')) {
			return false;
		}
		
		//Select note tab of item pane
		var tabIndex = 1;
		var zoteroViewTabbox = 
			ZoteroPane.document.getElementById("zotero-view-tabbox");
		zoteroViewTabbox.selectedIndex = tabIndex;
		//Create new note
		ZoteroPane.newNote(false, zitems[0].id);
		//This version didn't work in tab mode:
		//ZoteroItemPane.addNote(false);
		
		return true;
	},
		
	addTagGUI: function() {
		var zitems = this.getSelectedItems('regular');
		if (!this.checkItemNumber(zitems,'regularSingle')) {
			return false;
		}
		
		//Select tag tab of item pane
		var tabIndex = 2;
		var zoteroViewTabbox = 
			ZoteroPane.document.getElementById("zotero-view-tabbox");
		zoteroViewTabbox.selectedIndex = tabIndex;
		//Focus new tag entry textbox
		ZoteroPane.document.getElementById("zotero-editpane-tags").new();
		
		return true;
	},
		
	addRelatedGUI: function() {
		var zitems = this.getSelectedItems('regular');
		if (!this.checkItemNumber(zitems,'regularSingle')) {
			return false;
		}
		
		//Select related tab of item pane
		var tabIndex = 3;
		var zoteroViewTabbox = 
			ZoteroPane.document.getElementById("zotero-view-tabbox");
		zoteroViewTabbox.selectedIndex = tabIndex;
		//Open add related window
		ZoteroPane.document.getElementById("zotero-editpane-related").add();
		
		return true;
	},
		
	///////////////////////////////////////////
	// Functions called from Zotero item menu
	///////////////////////////////////////////
	copyCreators: function() {
		var zitems = this.getSelectedItems('regular');
		
		if (!this.checkItemNumber(zitems,'regular1')) {
			return false;
		}
		
		var creatorsArray = [];
		for (var i = 0; i < zitems.length; i++) {
			var tempCreators = zitems[i].getCreators();
			var arrayStr = '';
			for (var j = 0; j < tempCreators.length; j++) {
				arrayStr = '\n' + creatorsArray.join('\n') + '\n';
				var tempName = tempCreators[j].ref.lastName;
				tempName += '\t' + tempCreators[j].ref.firstName;
				tempName = tempName.replace(/^\s+|\s+$/g, '') ;
				if (arrayStr.indexOf('\n' + tempName + '\n') == -1) {
					creatorsArray.push(tempName);
				}
			}
		}
		var clipboardText = creatorsArray.join('\r\n');
		
		const gClipboardHelper = 
			Components.classes["@mozilla.org/widget/clipboardhelper;1"]
            .getService(Components.interfaces.nsIClipboardHelper);
		gClipboardHelper.copyString(clipboardText,document);
		
		return true;
	},
		
	copyTags: function() {
		var zitems = this.getSelectedItems('regular');
		
		if (!this.checkItemNumber(zitems,'regular1')) {
			return false;
		}
		
		var tagsArray = [];
		for (var i = 0; i < zitems.length; i++) {
			//The following line might be needed to work around some item 
			//handling issues, but I will leave it out for now.
			//var tempID = Zotero.Items.getLibraryKeyHash(zitems[i]);
			var tempTags = zitems[i].getTags();
			var arrayStr = '';
			for (var j = 0; j < tempTags.length; j++) {
				arrayStr = '\n' + tagsArray.join('\n') + '\n';
				if (arrayStr.indexOf('\n' + tempTags[j].name + '\n') == -1) {
					tagsArray.push(tempTags[j].name);
				}
			}
		}
		var clipboardText = tagsArray.join('\r\n');
		
		const gClipboardHelper = 
			Components.classes["@mozilla.org/widget/clipboardhelper;1"]
            .getService(Components.interfaces.nsIClipboardHelper);
		gClipboardHelper.copyString(clipboardText,document);
		
		return true;
	},
		
	pasteTags: function() {
		var zitems = this.getSelectedItems('regular');
		
		if (!this.checkItemNumber(zitems,'regular1')) {
			return false;
		}
		
		var clipboardText = ZutiloChrome.getFromClipboard();
		if (!clipboardText) {
			return false;
		}
		
		var tagArray = clipboardText.split(/\r\n?|\n/);
		
		for (var i = 0; i < zitems.length; i++) {
			//The following line might be needed to work around some item 
			//handling issues, but I will leave it out for now.
			//var tempID = Zotero.Items.getLibraryKeyHash(zitems[i]);
			zitems[i].addTags(tagArray);
		}
		
		return true;
	},
		
	modifyAttachments: function() {
		var attachmentArray = this.getSelectedAttachments();
		
		if (!this.checkItemNumber(attachmentArray,'attachment1')) {
			return false;
		}
		var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].
			getService(Components.interfaces.nsIPromptService);
		var promptTitle = 
			Zutilo._bundle.GetStringFromName("zutilo.attachments.modifyTitle");
		
		// Prompt for old path
		var promptText = { value: "" };
		var checkGlobal = { value: false };
		var pressedOK = prompts.prompt(null,promptTitle,
			Zutilo._bundle.GetStringFromName("zutilo.attachments.oldPath"),
			promptText,
			Zutilo._bundle.GetStringFromName("zutilo.attachments.checkGlobally"),
			checkGlobal);
		var oldPath = promptText.value;
		if (!pressedOK || (oldPath == "")) {
			return false;
		}
		
		// Prompt for new path
		promptText = { value: "" };
		pressedOK = prompts.prompt(null,promptTitle,
			Zutilo._bundle.GetStringFromName("zutilo.attachments.newPath"),
			promptText,null,{});
		var newPath = promptText.value;
		if (!pressedOK) {
			return false;
		}
		
		// Loop through attachments and replace partial paths
		var attachmentPath;
		for (var index=0; index<attachmentArray.length; index++) {
			attachmentPath = attachmentArray[index].attachmentPath;
			if (checkGlobal.value) {
				attachmentArray[index].attachmentPath =
					attachmentPath.replace(
						RegExp(Zutilo.escapeForRegExp(oldPath),"g"),
						newPath);
			} else {
			// If only check beginning of strings, just do quick compare and 
			// substitution (I think this might be faster than replace() ).
				if (attachmentPath.substr(0,oldPath.length) == oldPath) {
					attachmentArray[index].attachmentPath = 
						newPath + attachmentPath.substr(oldPath.length);
				}
			}
		}
		
		return true;
	},
	
	showAttachments: function() {
		var attachmentArray = this.getSelectedAttachments();
		
		if (!this.checkItemNumber(attachmentArray,'attachment1')) {
			return false;
		}
		
		var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].
			getService(Components.interfaces.nsIPromptService);
		for (var index=0; index<attachmentArray.length; index++) {
			var title = Zutilo._bundle.
				formatStringFromName("zutilo.attachments.showTitle",
				[index+1,attachmentArray.length],2);
			prompts.alert(null,title,attachmentArray[index].attachmentPath);
		}
		return true;
	},
    
	relateItems: function() {
		var zitems = this.getSelectedItems('regular');
		
		if (!this.checkItemNumber(zitems,'regular2')) {
			return false;
		}
		
		var ids = [];
		for (var ii = 0; ii<zitems.length; ii++) {
			ids[ii] = zitems[ii].id;
		}
		for (ii = 0; ii<zitems.length; ii++) {
			for (var jj=0; jj<ids.length; jj++) {
				if (ii != jj) {
					zitems[ii].addRelatedItem(ids[jj]);
				}
			}
		}
		
		return true;
	},
	
	///////////////////////////////////////////
	//XUL overlay functions
	///////////////////////////////////////////
	staticOverlay: function() {
		
		// Add Zutilo preferences item to Zotero actions menu
		var zutiloMenuItem = document.createElement("menuitem");
		zutiloMenuItem.setAttribute("id","zutilo-zotero-actions-preferences");
		zutiloMenuItem.setAttribute("label",
			Zutilo._bundle.GetStringFromName("zutilo.zotero.actions.preferences"));
		zutiloMenuItem.setAttribute("oncommand","ZutiloChrome.openPreferences()");
		var zoteroActionMenu=document.getElementById("zotero-tb-actions-popup");
		var zoteroPrefsItem = 
			document.getElementById("zotero-tb-actions-prefs");
		zoteroActionMenu.insertBefore(zutiloMenuItem, zoteroPrefsItem.nextSibling);
	},
	
	removeXUL: function() {
		this.removeZoteroItemPopup();
		var zutiloPrefMenuItem=
			document.getElementById("zutilo-zotero-actions-preferences");
		zutiloPrefMenuItem.parentNode.removeChild(zutiloPrefMenuItem);
	},
	
	///////////////////////////////////////////
	//Item menu functions
	///////////////////////////////////////////
	
	itemmenuPrefObserver: {
		observe: function(subject, topic, data) {
			switch (topic) {
				case "zutilo-zoteroitemmenu-update":
					ZutiloChrome.zoteroOverlay.refreshZoteroItemPopup();
					break;
				case "zutilo-shutdown":
					ZutiloChrome.zoteroOverlay.removeXUL();
					this.unregister();
					break;
				case "zutilo-window-close":
					if (subject == window) {
						this.unregister();
					}
					break;
				default:
			}
		},
		
		register: function() {
			Services.obs.addObserver(this, "zutilo-zoteroitemmenu-update", false);
			Services.obs.addObserver(this, "zutilo-shutdown", false);
			Services.obs.addObserver(this, "zutilo-window-close", false);
		},
		  
		unregister: function() {
			Services.obs.removeObserver(this, "zutilo-zoteroitemmenu-update");
			Services.obs.removeObserver(this, "zutilo-shutdown");
			Services.obs.removeObserver(this, "zutilo-window-close");
		  }
	},
		
	zoteroItemPopup: function() {
		var zoteroItemmenu = document.getElementById("zotero-itemmenu");
		
		var appSettings = new Array(Zutilo._itemmenuFunctions.length);
		for (var index=0;index<appSettings.length;index++) {
			appSettings[index] = Zutilo.Prefs.get('itemmenu.'+Zutilo._itemmenuFunctions[index]);
		}
		
		if ((appSettings.indexOf('Zotero') != -1) || 
			(appSettings.indexOf('Zutilo') != -1)) {
			var zutiloSeparator = document.createElement("menuseparator");
			zutiloSeparator.setAttribute('id','zutilo-itemmenu-separator');
			zoteroItemmenu.appendChild(zutiloSeparator);
		} else {
			return;
		}
			
		if (appSettings.indexOf('Zotero') != -1) {
			this._addPopupItems(zoteroItemmenu,appSettings,'Zotero');
		}
		
		if (appSettings.indexOf('Zutilo') != -1) {
			var zutiloSubmenu = document.createElement("menu");
			zutiloSubmenu.setAttribute("id","zutilo-itemmenu-submenu");
			zutiloSubmenu.setAttribute("label",
				Zutilo._bundle.GetStringFromName("zutilo.itemmenu.zutilo"));
			zoteroItemmenu.appendChild(zutiloSubmenu);
			
			var zutiloSubmenuPopup = document.createElement("menupopup");
			zutiloSubmenuPopup.setAttribute("id","zutilo-itemmenu-submenupopup");
			zutiloSubmenu.appendChild(zutiloSubmenuPopup);
			
			this._addPopupItems(zutiloSubmenuPopup,appSettings,'Zutilo');
		}
	},
	
	removeZoteroItemPopup: function() {
		var zoteroItemmenu = document.getElementById("zotero-itemmenu");
		this._removeLabeledChildren(zoteroItemmenu,'zutilo-itemmenu-');
	},
		
	refreshZoteroItemPopup: function() {
		this.removeZoteroItemPopup();
		this.zoteroItemPopup();
	},
		
	_addPopupItems: function(menuPopup,appearanceSettings,targetSetting) {
		var menuFunc;
		for (var index=0;index<Zutilo._itemmenuFunctions.length;index++) {
			if (appearanceSettings[index] === targetSetting) {
				menuFunc = this._zoteroMenuItem(Zutilo._itemmenuFunctions[index]);
				menuPopup.appendChild(menuFunc);
			}
		}
	},
		
	_zoteroMenuItem: function(functionName) {
		var menuFunc = document.createElement("menuitem");
		menuFunc.setAttribute("id","zutilo-itemmenu-" + functionName);
		menuFunc.setAttribute("label",
			Zutilo._bundle.GetStringFromName("zutilo.itemmenu."+functionName));
		menuFunc.addEventListener('command', 
			function() {
				ZutiloChrome.zoteroOverlay[functionName]();
			},false);
		return menuFunc;
	},
		
	//Remove labeled children and all of their descendants.
	_removeLabeledChildren: function(parentElem,childLabel) {
		var elemChildren = parentElem.childNodes;
	
		for (var index=0;index<elemChildren.length;) {
			if (elemChildren[index].id.indexOf(childLabel) == 0) {
				this._removeAllDescendants(elemChildren[index]);
				parentElem.removeChild(elemChildren[index]);
			} else {
				index++;
			}
		}
	},
		
	_removeAllDescendants: function(parentElem) {
		var childList = parentElem.childNodes;
		for (var index=0;index<childList.length;index++) {
			this._removeAllDescendants(childList[index]);
			parentElem.removeChild(childList[index]);
		}
	},
	
	///////////////////////////////////////////
	// Zotero item selection and sorting
	///////////////////////////////////////////
	
	//Get all selected attachment items and all of the child attachments of all selected 
	//regular items.  
	//To get just the selected attachment items, 
	//use Zutilo.siftItems(inputArray,'attachment') instead.
	getSelectedAttachments: function() {
		
		var zitems = this.getSelectedItems();
		if (!zitems) {
			return [];
		}
		
		//Add child attachments of all selected regular items to attachmentItems
		var zitem, attachmentItems=[];
		while (zitems.length > 0) {
			zitem = zitems.shift();
			
			if (zitem.isRegularItem()) {
				attachmentItems = 
					attachmentItems.concat(Zotero.Items.get(zitem.getAttachments(false)));
			} else if (zitem.isAttachment()) {
				attachmentItems.push(zitem);
			}
		}
		
		//Return attachments after removing duplicate items (when parent and child are 
		//selected)
		return this.removeDuplicateItems(attachmentItems);
	},
		
	//Return array with the selected item objects.  If itemTypeID is passed, return
	//only items of that type
	getSelectedItems: function(itemType) {
		var zitems = window.ZoteroPane.getSelectedItems();
		if (!zitems.length) {
			return false;
		}
		
		if (itemType) {
			var siftedItems=this.siftItems(zitems,itemType);
			return siftedItems.matched;
		} else {
			return zitems;
		}
	},
	
	checkItemType: function(itemObj,itemType) {
		switch (itemType) {
			case "attachment":
				return itemObj.isAttachment();
			case "note":
				return itemObj.isNote();
			case "regular":
				return itemObj.isRegularItem();
				break;
			default:
		}
		return Zotero.ItemTypes.getName(itemObj.itemTypeID) == itemType;
	},
		
	//Remove duplicate Zotero item objects from itemArray
	removeDuplicateItems: function(itemArray) {
		//Get array of itemID's
		var itemIDArray=[];
		for (var index=0;index<itemArray.length;index++) {
			itemIDArray[index]=itemArray[index].itemID;
		}
		
		//Create array of unique itemID's
		var tempObject={}, uniqueIDs=[];
		for (index=0;index<itemIDArray.length;index++) {
			tempObject[itemIDArray[index]]=itemIDArray[index];
		}
		for (index in tempObject) uniqueIDs.push(tempObject[index]);
		
		return Zotero.Items.get(uniqueIDs);
	},
		
	//Separate itemArray into an array of items with type itemType and an array with those 
	//with different item types
	siftItems: function(itemArray, itemType) {
		var matchedItems=[], unmatchedItems=[];
		var numItems=itemArray.length;
		while (itemArray.length>0) {
			if (this.checkItemType(itemArray[0],itemType)) {
				matchedItems.push(itemArray.shift());
			} else {
				unmatchedItems.push(itemArray.shift());
			}
		}
		
		return {
			'matched': matchedItems,
			'unmatched': unmatchedItems
		};
	},
	
	checkItemNumber: function(itemArray, checkType) {
		var checkBool=true;
		
		var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].
			getService(Components.interfaces.nsIPromptService);
		
		var errorTitle = Zutilo._bundle.GetStringFromName("zutilo.checkItems.errorTitle");
		switch (checkType) {
			case 'regular1':
				if (!itemArray.length) {
					prompts.alert(null,errorTitle,Zutilo._bundle.
						GetStringFromName("zutilo.checkItems.regular1"));
					checkBool = false;
				}
				break;
			case 'regularSingle':
				if ((!itemArray.length) || (itemArray.length>1)) {
					prompts.alert(null,errorTitle,Zutilo._bundle.
						GetStringFromName("zutilo.checkItems.regularSingle"));
					checkBool = false;
				}
				break;
			case 'regular2':
				if ((!itemArray.length) || (itemArray.length<2)) {
					prompts.alert(null,errorTitle,Zutilo._bundle.
						GetStringFromName("zutilo.checkItems.regular2"));
					checkBool = false;
				}
				break;
			case 'attachment1':
				if (!itemArray.length) {
					prompts.alert(null,errorTitle,Zutilo._bundle.
						GetStringFromName("zutilo.checkItems.attachment1"));
					checkBool = false;
				}
				break;
		}
		
		return checkBool;
	}
};


ZutiloChrome.zoteroOverlay.warnOldFunctions = function () {
	var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].
			getService(Components.interfaces.nsIPromptService);
	prompts.alert(null,Zutilo._bundle.
		GetStringFromName("zutilo.upgrade.deprecatedfunctiontitle"),
		Zutilo._bundle.
		GetStringFromName("zutilo.upgrade.deprecatedfunctionwarning"));
};
Zotero.Zutilo = function() {};
Zotero.Zutilo.copyTags=ZutiloChrome.zoteroOverlay.warnOldFunctions;
Zotero.Zutilo.copyCreators=ZutiloChrome.zoteroOverlay.warnOldFunctions;
Zotero.Zutilo.pasteTags=ZutiloChrome.zoteroOverlay.warnOldFunctions;
Zotero.Zutilo.showAttachments=ZutiloChrome.zoteroOverlay.warnOldFunctions;
Zotero.Zutilo.modifyAttachments=ZutiloChrome.zoteroOverlay.warnOldFunctions;
Zotero.Zutilo.relateItems=ZutiloChrome.zoteroOverlay.warnOldFunctions;
Zotero.Zutilo.editItemInfoGUI=ZutiloChrome.zoteroOverlay.warnOldFunctions;
Zotero.Zutilo.addNoteGUI=ZutiloChrome.zoteroOverlay.warnOldFunctions;
Zotero.Zutilo.addTagGUI=ZutiloChrome.zoteroOverlay.warnOldFunctions;
Zotero.Zutilo.addRelatedGUI=ZutiloChrome.zoteroOverlay.warnOldFunctions;

// Initialize the utility
window.addEventListener('unload', function(e) {
		Services.obs.notifyObservers(window, "zutilo-window-close", null);; 
	}, false);
/* Copyright 2012 Will Shanks.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
 
Components.utils.import("resource://zutilomodules/zutilo.jsm");
Components.utils.import("resource://zutilomodules/preferences.jsm");
 
 /**
 * ZutiloChrome namespace.
 */
if ("undefined" == typeof(ZutiloChrome)) {
  var ZutiloChrome = {};
};

ZutiloChrome.zoteroOverlay = {
	///////////////////////////////////////////
	// Window load handling
	///////////////////////////////////////////
	init: function() {
		var that = this;
		window.setTimeout(function() { that.initPostLoad(); }, 500);
	},
	
	initPostLoad: function() {
		this.wm = Components.classes["@mozilla.org/appshell/window-mediator;1"]
				.getService(Components.interfaces.nsIWindowMediator);
		
		this.checkIfUpgraded();
		
		this.itemmenuPrefObserver.register();
		
		this.zoteroItemPopup();
	},
	
	cleanup: function() {
		this.itemmenuPrefObserver.unregister();
	},
	
	checkIfUpgraded: function() {
		Application.getExtensions(function (extensions) {
			var zutiloExtension = extensions.get(Zutilo.id);
		 
			if (zutiloExtension.firstRun) {
				var upgradeMsg = 
					Zutilo._bundle.GetStringFromName("zutilo.startup.upgrademessage");
				if (upgradeMsg) {
					alert(upgradeMsg);
				}
			}
		});
		
	},
	
	///////////////////////////////////////////
	// Functions for GUI keyboard shortcuts
	///////////////////////////////////////////	
	editItemInfoGUI: function() {
		var win = this.wm.getMostRecentWindow("navigator:browser");
		var zitems = win.ZoteroPane.getSelectedItems();
		
		if (zitems.length == 1) {
			var tabIndex = 0;
			
			var zoteroViewTabbox = 
				document.getElementById("zotero-view-tabbox");
			zoteroViewTabbox.selectedIndex = tabIndex;
			
			itemBoxObj=document.getElementById("zotero-editpane-item-box").
				focusFirstField('info');
		}
	},
		
	addNoteGUI: function() {
		var win = this.wm.getMostRecentWindow("navigator:browser");
		var zitems = win.ZoteroPane.getSelectedItems();
		
		if (zitems.length == 1) {
			var tabIndex = 1;
			
			var zoteroViewTabbox = 
				document.getElementById("zotero-view-tabbox");
			zoteroViewTabbox.selectedIndex = tabIndex;
			//This version didn't work in tab mode:
			//ZoteroPane.newNote(false, zitems[0].id); 
			ZoteroItemPane.addNote(false);
		}
	},
		
	addTagGUI: function() {
		var win = this.wm.getMostRecentWindow("navigator:browser");
		var zitems = win.ZoteroPane.getSelectedItems();
		
		if (zitems.length == 1) {
			var tabIndex = 2;
			
			var zoteroViewTabbox = 
				document.getElementById("zotero-view-tabbox");
			zoteroViewTabbox.selectedIndex = tabIndex;
			
			document.getElementById("zotero-editpane-tags").new();
		}
	},
		
	addRelatedGUI: function() {
		var win = this.wm.getMostRecentWindow("navigator:browser");
		var zitems = win.ZoteroPane.getSelectedItems();
		
		if (zitems.length == 1) {
			var tabIndex = 3;
			
			var zoteroViewTabbox = 
				document.getElementById("zotero-view-tabbox");
			zoteroViewTabbox.selectedIndex = tabIndex;
			
			document.getElementById("zotero-editpane-related").add();
		}
	},
		
	///////////////////////////////////////////
	// Functions called from Zotero item menu
	///////////////////////////////////////////
	copyCreators: function() {
		
		var win = this.wm.getMostRecentWindow("navigator:browser");
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
		
		return this.addToClipboard(clipboardText);
	},
		
	copyTags: function() {
		var win = this.wm.getMostRecentWindow("navigator:browser");
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
		
		return this.addToClipboard(clipboardText);
	},
		
	pasteTags: function() {
		
		var win = this.wm.getMostRecentWindow("navigator:browser");
		var zitems = this.getSelectedItems('regular');
		
		if (!this.checkItemNumber(zitems,'regular1')) {
			return false;
		}
		
		var clipboardText = this.getFromClipboard();
		
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
		
		var win = this.wm.getMostRecentWindow("navigator:browser");
		var attachmentArray = this.getSelectedAttachments();
		
		if (!this.checkItemNumber(attachmentArray,'attachment1')) {
			return false;
		}
		
		var oldPath = prompt(this._bundle.GetStringFromName("zutilo.attachments.oldPath"), "");
		var newPath = prompt(this._bundle.GetStringFromName("zutilo.attachments.newPath"), "");
		
		if ((oldPath == null) || (newPath == null)) {
			return false;
		}
		
		var attachmentPath;
		for (var index=0; index<attachmentArray.length; index++) {
			attachmentPath = attachmentArray[index].attachmentPath;
			if (attachmentPath.search(oldPath) == 0) {
				attachmentArray[index].attachmentPath = 
					attachmentPath.replace(oldPath,newPath);
			}
		}
		
		return true;
	},
	
	showAttachments: function() {
	
		var win = this.wm.getMostRecentWindow("navigator:browser");
		var attachmentArray = this.getSelectedAttachments();
		
		if (!this.checkItemNumber(attachmentArray,'attachment1')) {
			return false;
		}
		
		for (var index=0; index<attachmentArray.length; index++) {
			win.alert(attachmentArray[index].attachmentPath);
		}
		return true;
	},
    
	relateItems: function() {
		var win = this.wm.getMostRecentWindow("navigator:browser");
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
	//Item menu functions
	///////////////////////////////////////////
	
	itemmenuPrefObserver: {
		observe: function(subject, topic, data) {
			 ZutiloChrome.zoteroOverlay.refreshZoteroItemPopup();
		},
		
		register: function() {
			var observerService = Components.classes["@mozilla.org/observer-service;1"]
								  .getService(Components.interfaces.nsIObserverService);
			observerService.addObserver(this, "zutilo-zoteroitemmenu-update", false);
		},
		  
		unregister: function() {
			var observerService = Components.classes["@mozilla.org/observer-service;1"]
									.getService(Components.interfaces.nsIObserverService);
			observerService.removeObserver(this, "zutilo-zoteroitemmenu-update");
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
		
	refreshZoteroItemPopup: function() {
		var zoteroItemmenu = document.getElementById("zotero-itemmenu");
		
		this._removeLabeledChildren(zoteroItemmenu,'zutilo-itemmenu-');
		
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
	// Functions for Zotero actions menu
	///////////////////////////////////////////
	openPreferences: function (paneID, action) {
		var io = {
			pane: paneID,
			action: action
		};
		// Not sure this instantApply check is important.  Mozilla warns against
		//using browser.preferences.instantApply, so just leaving dialog=yes on for now.
		//var featureStr='chrome,titlebar,toolbar=yes,resizable,centerscreen,';
		//var modalStr = Zotero.Prefs.get('browser.preferences.instantApply', true) 
		//	? 'dialog=yes' : 'modal';
		//featureStr=featureStr+modalStr;
		window.openDialog('chrome://zutilo/content/preferences.xul',
			'zutilo-prefs',
			'chrome,titlebar,toolbar=yes,resizable,centerscreen,dialog=yes'
			,io);
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
		var win = this.wm.getMostRecentWindow("navigator:browser");
		var zitems = win.ZoteroPane.getSelectedItems();
		
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
		var win = this.wm.getMostRecentWindow("navigator:browser");
		var checkBool=true;
		
		switch (checkType) {
			case 'regular1':
				if (!itemArray.length) {
					win.alert(Zutilo._bundle.
						GetStringFromName("zutilo.checkItems.regular1"));
					checkBool = false;
				}
				break;
			case 'regular2':
				if ((!itemArray.length) || (itemArray.length<2)) {
					win.alert(Zutilo._bundle.
						GetStringFromName("zutilo.checkItems.regular2"));
					checkBool = false;
				}
				break;
			case 'attachment1':
				if (!itemArray.length) {
					win.alert(Zutilo._bundle.
						GetStringFromName("zutilo.checkItems.attachment1"));
					checkBool = false;
				}
				break;
		}
		
		return checkBool;
	},
	
	///////////////////////////////////////////
	// Clipboard functions
	///////////////////////////////////////////
	addToClipboard: function(clipboardText) {
		
		var str = Components.classes["@mozilla.org/supports-string;1"].
			createInstance(Components.interfaces.nsISupportsString);
		if (!str) {
			return false;
		}
		str.data = clipboardText;
	
		var trans = Components.classes["@mozilla.org/widget/transferable;1"].
			  createInstance(Components.interfaces.nsITransferable);
		if (!trans) {
			return false;
		}
		
		var sourceWindow = document.defaultView;
		var privacyContext = 
			sourceWindow.QueryInterface(Components.interfaces.nsIInterfaceRequestor).
			getInterface(Components.interfaces.nsIWebNavigation).
			QueryInterface(Components.interfaces.nsILoadContext);
		if ('init' in trans) {
			trans.init(privacyContext);
		}
	
		trans.addDataFlavor("text/unicode");
		trans.setTransferData("text/unicode",str,clipboardText.length * 2);
	
		var clipid = Components.interfaces.nsIClipboard;
		var clip = Components.classes["@mozilla.org/widget/clipboard;1"].getService(clipid);
		if (!clip) {
			return false;
		}
		
		clip.setData(trans,null,clipid.kGlobalClipboard);
		return true;
	},
	
	getFromClipboard: function() {
	
		var trans = Components.classes["@mozilla.org/widget/transferable;1"].
			  createInstance(Components.interfaces.nsITransferable);
		if (!trans) return false;
		if ('init' in trans) {
			trans.init(null);
		}
		trans.addDataFlavor("text/unicode");
	
		var clip = Components.classes["@mozilla.org/widget/clipboard;1"].
			getService(Components.interfaces.nsIClipboard);
		if (!clip) return false;
		
		clip.getData(trans,clip.kGlobalClipboard);
		
		var str = new Object();
		var strLength = new Object();
		
		trans.getTransferData("text/unicode", str, strLength);
		
		if (str) {
		  str = str.value.QueryInterface(Components.interfaces.nsISupportsString);
		  pasteText = str.data.substring(0, strLength.value / 2);
		} else {
			pasteText='';
		}
		
		return pasteText;
	}
};

// Initialize the utility
window.addEventListener('load', function(e) {
		ZutiloChrome.zoteroOverlay.init(); 
	}, false);
window.addEventListener('unload', function(e) {
		ZutiloChrome.zoteroOverlay.cleanup(); 
	}, false);
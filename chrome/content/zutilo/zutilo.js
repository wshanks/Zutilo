/* Copyright 2012 Will Shanks.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */


Zotero.Zutilo = {
	DB: null,
	
	init: function () {
	
		Zotero.Zutilo.Prefs.init();
		Zotero.Zutilo.ZoteroPrefs.init();
		
        this.wm = Components.classes["@mozilla.org/appshell/window-mediator;1"]
				.getService(Components.interfaces.nsIWindowMediator);
				
		var gmyextensionBundle = Components.classes["@mozilla.org/intl/stringbundle;1"].getService(Components.interfaces.nsIStringBundleService);  
  
		this._bundle = gmyextensionBundle.createBundle("chrome://zutilo/locale/zutilo.properties");
		
		//Add item to Zotero menu of contentAreaContextMenu for 
		//saving links as attachments.
		/** Not ready for release
		var menu = document.getElementById("zotero-content-area-context-menu");
		var popup = menu.menupopup;
		const XUL_NS = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";
		var item = document.createElementNS(XUL_NS, "menuitem"); // create a new XUL menuitem
		item.setAttribute("label", this._bundle.GetStringFromName("zutilo.context.savelink"));
		item.setAttribute("id", "contentAreaContextMenu-zotero-zutilo-attach");
		item.setAttribute("oncommand", "Zotero.Zutilo.saveAsAttachment();");
		popup.appendChild(item);
		menu = document.getElementById("contentAreaContextMenu");
		menu.addEventListener("popupshowing", Zotero.Zutilo.contextPopup, false);
		**/
		
		//Event listener currently not used.  Menu is created by zoteroItemPopup() 
		//and left alone until preferences are changed.
		//Add event listener to add items to Zotero item menu popup
		/** var menu = document.getElementById("zotero-itemmenu");
		menu.addEventListener("popupshowing", function() {
			Zotero.Zutilo.zoteroItemPopup();
		}, false); **/
		
		//All strings here should be the exact name of Zutilo functions that take no
		//argument and that should be able to be called from the Zotero item menu
		this._itemmenuFunctions = ["copyTags","pasteTags","relateItems","showAttachments",
			"modifyAttachments","copyCreators"];
		this._defaults = new Object();
		this._defaults.itemmenuAppearance = 'Zutilo';
		
		//Set up prefs
		this.prefSetup();
		//Set up item menu submenu
		this.zoteroItemPopupSetup();
	},
	
	prefSetup: function() {
		//Get each itemmenu pref.  Any undefined pref will be set to the default value
		for (var index=0;index<this._itemmenuFunctions.length;index++) {
			Zotero.Zutilo.Prefs.get('itemmenu.'+this._itemmenuFunctions[index]);
		}
	},
	
	zoteroDocument: function () {
		var zDoc = document;
		
		if (Zotero.Prefs.get('showIn')!=1) {
			var numTabs = gBrowser.browsers.length;
			for(var index = 0; index < numTabs; index++) {
				var currentBrowser = gBrowser.getBrowserAtIndex(index);
				if(ZOTERO_TAB_URL == currentBrowser.currentURI.spec) {
					zDoc = currentBrowser.contentDocument;
					break;
				}
			}
		}
		
		return zDoc;
	},
	
	zoteroItemPopupSetup: function() {
		// For tab mode, Zotero creates the tab and overlay after Zutilo is loaded, so
		// the Zotero item menu can't be overlaid yet.  Create a listener to overlay on
		// its first appearance.
		if (Zotero.Prefs.get('showIn')!=1) {
			gBrowser.addEventListener("load", function zutiloFirstTabPopup(event) {
				var tabDoc = event.originalTarget;
				if (tabDoc.defaultView.location == ZOTERO_TAB_URL) {
					Zotero.Zutilo.refreshZoteroItemPopup();
					gBrowser.removeEventListener("load",zutiloFirstTabPopup,false);
				}
			}, true);
		} else {
			this.zoteroItemPopup();
		}
	},
	
	zoteroItemPopup: function() {
    	var zDoc = this.zoteroDocument();
    	
    	var zoteroItemmenu = zDoc.getElementById("zotero-itemmenu");
    	
    	var appSettings = new Array(this._itemmenuFunctions.length);
    	for (var index=0;index<appSettings.length;index++) {
    		appSettings[index] = this.Prefs.get('itemmenu.'+this._itemmenuFunctions[index]);
    	}
    	
    	if ((appSettings.indexOf('Zotero') != -1) || 
    		(appSettings.indexOf('Zutilo') != -1)) {
			var zutiloSeparator = zDoc.createElement("menuseparator");
			zutiloSeparator.setAttribute('id','zutilo-itemmenu-separator');
			zoteroItemmenu.appendChild(zutiloSeparator);
		} else {
			return;
		}
			
    	if (appSettings.indexOf('Zotero') != -1) {
			this._addPopupItems(zoteroItemmenu,appSettings,'Zotero');
		}
		
		if (appSettings.indexOf('Zutilo') != -1) {
			var zutiloSubmenu = zDoc.createElement("menu");
			zutiloSubmenu.setAttribute("id","zutilo-itemmenu-submenu");
			zutiloSubmenu.setAttribute("label",
				this._bundle.GetStringFromName("zutilo.itemmenu.zutilo"));
			zoteroItemmenu.appendChild(zutiloSubmenu);
			
			var zutiloSubmenuPopup = zDoc.createElement("menupopup");
			zutiloSubmenuPopup.setAttribute("id","zutilo-itemmenu-submenupopup");
			zutiloSubmenu.appendChild(zutiloSubmenuPopup);
			
			this._addPopupItems(zutiloSubmenuPopup,appSettings,'Zutilo');
		}
    },
    
    refreshZoteroItemPopup: function() {
    	var zDoc = this.zoteroDocument();
    	var zoteroItemmenu = zDoc.getElementById("zotero-itemmenu");
    	
    	this._removeLabeledChildren(zoteroItemmenu,'zutilo-itemmenu-');
    	
    	this.zoteroItemPopup();
    },
    
    _addPopupItems: function(menuPopup,appearanceSettings,targetSetting) {
    	var menuFunc;
    	for (var index=0;index<this._itemmenuFunctions.length;index++) {
    		if (appearanceSettings[index] === targetSetting) {
				menuFunc = this._zoteroMenuItem(this._itemmenuFunctions[index]);
				menuPopup.appendChild(menuFunc);
    		}
    	}
    },
    
    _zoteroMenuItem: function(functionName) {
    	var zDoc = this.zoteroDocument();
    	var menuFunc = zDoc.createElement("menuitem");
		menuFunc.setAttribute("id","zutilo-itemmenu-" + functionName);
		menuFunc.setAttribute("label",
			this._bundle.GetStringFromName("zutilo.itemmenu."+functionName));
		menuFunc.addEventListener('command', function() {Zotero.Zutilo[functionName]();},false);
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
	
	contextPopup: function () {
	
		menuitem = document.getElementById("contentAreaContextMenu-zotero-zutilo-attach");
	
		if (window.gContextMenu.onLink) {
			menuitem.hidden = false;
		}
		else {
			menuitem.hidden = true;
		}	
	},
	
	editItemInfoGUI: function() {
		var win = this.wm.getMostRecentWindow("navigator:browser");
		var zitems = win.ZoteroPane.getSelectedItems();
		
		if (zitems.length == 1) {
			var tabIndex = 0;
			
			var zoteroViewTabbox = 
				this.zoteroDocument().getElementById("zotero-view-tabbox");
			zoteroViewTabbox.selectedIndex = tabIndex;
			
			itemBoxObj=this.zoteroDocument().getElementById("zotero-editpane-item-box").
				focusFirstField('info');
		}
	},
	
	addNoteGUI: function() {
		var win = this.wm.getMostRecentWindow("navigator:browser");
		var zitems = win.ZoteroPane.getSelectedItems();
		
		if (zitems.length == 1) {
			var tabIndex = 1;
			
			var zoteroViewTabbox = 
				this.zoteroDocument().getElementById("zotero-view-tabbox");
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
				this.zoteroDocument().getElementById("zotero-view-tabbox");
			zoteroViewTabbox.selectedIndex = tabIndex;
			
			this.zoteroDocument().getElementById("zotero-editpane-tags").new();
		}
	},
	
	addRelatedGUI: function() {
		var win = this.wm.getMostRecentWindow("navigator:browser");
		var zitems = win.ZoteroPane.getSelectedItems();
		
		if (zitems.length == 1) {
			var tabIndex = 3;
			
			var zoteroViewTabbox = 
				this.zoteroDocument().getElementById("zotero-view-tabbox");
			zoteroViewTabbox.selectedIndex = tabIndex;
			
			this.zoteroDocument().getElementById("zotero-editpane-related").add();
		}
	},
	
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
    
    saveAsAttachment: function() {
    	//Check if save path exists
    	//Download to save path
    	//Add attachment to currently selected item(s)
    	var win = this.wm.getMostRecentWindow("navigator:browser");
    	var zitems = win.ZoteroPane.getSelectedItems();
    	
    	if (!zitems.length || zitems.length > 1)  {
			win.alert("Please select one item.");
			return false;
		}
    	
    	var zitem = zitems[0];
    	
		var link = this.getContextMenuLinkURL();
		link = Zotero.Utilities.resolveIntermediateURL(link);
		var uriObject = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService).newURI(link, null, null);
		var attachmentFile = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsIFile);
		var originalFileName = this.getDefaultFileName(uriObject);
		
		var baseDir = Zotero.ZotFile.prefs.getCharPref("dest_dir");
		var filename = Zotero.ZotFile.getFilename(zitem, originalFileName);
		var location = Zotero.ZotFile.getLocation(zitem,baseDir,Zotero.ZotFile.prefs.getBoolPref("subfolder"),Zotero.ZotFile.prefs.getCharPref("subfolderFormat"));
		
		//Validate location and create necessary subdirectories.
		destinationFile = Components.classes["@mozilla.org/file/local;1"]
			.createInstance(Components.interfaces.nsIFile);
		destinationFile.initWithPath(location);
		attachmentFile.setRelativeDescriptor(destinationFile,filename);
		
		if (!destinationFile.exists()) {
			destinationFile.create(Components.interfaces.nsIFile.DIRECTORY_TYPE,parseInt('0777',8));
		}
		
		//Download to location
		try {
			var acObject = new AutoChosen(attachmentFile, uriObject);

			internalSave(link, null, filename, null, null, false, null, acObject, null, false);
		}
		catch (e) {
			saveURL(link, attachmentFile, null, false, false, null);
		}
		
		//Create linked attachment in Zotero
		Zotero.Attachments.linkFromFile(attachmentFile, zitem.itemID,zitem.libraryID);
		
		return true;
    },
    
    getContextMenuLinkURL : function()
    {
        if (gContextMenu.linkURL.length)
            return(gContextMenu.linkURL);
        else
            return(gContextMenu.linkURL());
    },
    
    // compatibility issue
    getDefaultFileName : function(uri)
    {
        var fileName;

        try
        {
            fileName = getDefaultFileName(null, uri, null, null);
        }
        catch (e)
        {
            fileName = getDefaultFileName(null, null, uri, null);
        }

        return fileName;
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
    
    //Get all selected attachment items and all of the child attachments of all selected 
    //regular items.  
    //To get just the selected attachment items, 
    //use Zotero.Zutilo.siftItems(inputArray,'attachment') instead.
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
    
    checkItemNumber: function(itemArray, checkType) {
		var win = this.wm.getMostRecentWindow("navigator:browser");
    	var checkBool=true;
    	
    	switch (checkType) {
    		case 'regular1':
				if (!itemArray.length) {
					win.alert(this._bundle.GetStringFromName("zutilo.checkItems.regular1"));
					checkBool = false;
				}
				break;
    		case 'regular2':
				if ((!itemArray.length) || (itemArray.length<2)) {
					win.alert(this._bundle.GetStringFromName("zutilo.checkItems.regular2"));
					checkBool = false;
				}
				break;
    		case 'attachment1':
				if (!itemArray.length) {
					win.alert(this._bundle.GetStringFromName("zutilo.checkItems.attachment1"));
					checkBool = false;
				}
				break;
    	}
    	
    	return checkBool;
    }
};

Zotero.Zutilo.Prefs = new function() {
	// Privileged methods
	this.init = init;
	this.get = get;
	this.set = set;
	
	this.register = register;
	this.unregister = unregister;
	this.observe = observe;
	
	// Public properties
	//this.prefBranch; //Set in init()
	
	function init(){
		var prefs = Components.classes["@mozilla.org/preferences-service;1"]
						.getService(Components.interfaces.nsIPrefService);
		this.prefBranch = prefs.getBranch('extensions.zutilo.');
		
		// Register observer to handle pref changes
		this.register();
	}
	
	
	/**
	* Retrieve a preference
	**/
	
	function get(pref, global){
		var prefVal;
		try {
			if (global) {
				var service = Components.classes["@mozilla.org/preferences-service;1"]
					.getService(Components.interfaces.nsIPrefService);
			}
			else {
				var service = this.prefBranch;
			}
			
			switch (this.prefBranch.getPrefType(pref)){
				case this.prefBranch.PREF_BOOL:
					prefVal = this.prefBranch.getBoolPref(pref);
				case this.prefBranch.PREF_STRING:
					prefVal = this.prefBranch.getCharPref(pref);
				case this.prefBranch.PREF_INT:
					prefVal = this.prefBranch.getIntPref(pref);
			}
		}
		catch (e){
			//Do nothing because getting preferences always generates an error for some 
			//reason
		}
		
		if (!prefVal) {
			var splitPref = pref.split('.');
			if ((splitPref[0] == 'itemmenu') && 
				(Zotero.Zutilo._itemmenuFunctions.indexOf(splitPref[1]) != -1)) {
				Zotero.Zutilo.Prefs.set(pref,Zotero.Zutilo._defaults.itemmenuAppearance);
			}
		}
		
		return prefVal;
	}
	
	
	/**
	* Set a preference
	**/
	
	function set(pref, value) {
		try {
			switch (this.prefBranch.getPrefType(pref)){
				case this.prefBranch.PREF_BOOL:
					return this.prefBranch.setBoolPref(pref, value);
				case this.prefBranch.PREF_STRING:
					return this.prefBranch.setCharPref(pref, value);
				case this.prefBranch.PREF_INT:
					return this.prefBranch.setIntPref(pref, value);
				
				// If not an existing pref, create appropriate type automatically
				case 0:
					if (typeof value == 'boolean') {
						return this.prefBranch.setBoolPref(pref, value);
					}
					if (typeof value == 'string') {
						return this.prefBranch.setCharPref(pref, value);
					}
					if (parseInt(value) == value) {
						return this.prefBranch.setIntPref(pref, value);
					}
					throw ("Invalid preference value '" + value + "' for pref '" + pref + "'");
			}
		}
		catch (e){
			throw ("Invalid preference '" + pref + "'");
		}
		return false;
	}
	
	
	this.clear = function (pref) {
		try {
			this.prefBranch.clearUserPref(pref);
		}
		catch (e) {
			throw ("Invalid preference '" + pref + "'");
		}
	}
	
	//
	// Methods to register a preferences observer
	//
	function register(){
		this.prefBranch.QueryInterface(Components.interfaces.nsIPrefBranch);
		this.prefBranch.addObserver("", this, false);
	}
	
	function unregister(){
		if (!this.prefBranch){
			return;
		}
		this.prefBranch.removeObserver("", this);
	}
	
	function observe(subject, topic, data){
		if(topic!="nsPref:changed"){
			return;
		}
		// subject is the nsIPrefBranch we're observing (after appropriate QI)
		// data is the name of the pref that's been changed (relative to subject)
		switch (data){
			case "customAttachmentPath":
				break;
		}
		
		//Check for itemmenu preference change.  Refresh item menu if there is a change
		if (data.indexOf('itemmenu') == 0 ) {
			var prefParts = data.split('.');
			if (Zotero.Zutilo._itemmenuFunctions.indexOf(prefParts[1]) != -1) {
				Zotero.Zutilo.refreshZoteroItemPopup();
			}
		}
	}
}

Zotero.Zutilo.ZoteroPrefs = new function() {
	// Privileged methods
	this.init = init;
	
	this.register = register;
	this.unregister = unregister;
	this.observe = observe;
	
	// Public properties
	//this.prefBranch; //Set in init()
	
	function init(){
		var prefs = Components.classes["@mozilla.org/preferences-service;1"]
						.getService(Components.interfaces.nsIPrefService);
		this.prefBranch = prefs.getBranch('extensions.zotero.');
		
		// Register observer to handle pref changes
		this.register();
	}
	
	//
	// Methods to register a preferences observer
	//
	function register(){
		this.prefBranch.QueryInterface(Components.interfaces.nsIPrefBranch);
		this.prefBranch.addObserver("", this, false);
	}
	
	function unregister(){
		if (!this.prefBranch){
			return;
		}
		this.prefBranch.removeObserver("", this);
	}
	
	function observe(subject, topic, data){
		if(topic!="nsPref:changed"){
			return;
		}
		// subject is the nsIPrefBranch we're observing (after appropriate QI)
		// data is the name of the pref that's been changed (relative to subject)
		switch (data){
			case "showIn":
				Zotero.Zutilo.refreshZoteroItemPopup();
				break;
		}
	}
}

// Initialize the utility
window.addEventListener('load', function(e) { Zotero.Zutilo.init(); }, false);
window.addEventListener('unload', function(e) {Zotero.Zutilo.Prefs.unregister(); }, false);

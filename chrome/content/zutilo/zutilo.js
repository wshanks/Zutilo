Zotero.Zutilo = {
	DB: null,
	
	init: function () {
        this.wm = Components.classes["@mozilla.org/appshell/window-mediator;1"]
				.getService(Components.interfaces.nsIWindowMediator);
				
		var gmyextensionBundle = Components.classes["@mozilla.org/intl/stringbundle;1"].getService(Components.interfaces.nsIStringBundleService);  
  
		var _bundle = gmyextensionBundle.createBundle("chrome://zutilo/locale/zutilo.properties");
		
		//Add item to Zotero menu of contentAreaContextMenu for 
		//saving links as attachments.
		var menu = document.getElementById("zotero-content-area-context-menu");
		var popup = menu.menupopup;
		const XUL_NS = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";
		var item = document.createElementNS(XUL_NS, "menuitem"); // create a new XUL menuitem
		item.setAttribute("label", _bundle.GetStringFromName("zutilo.context.savelink"));
		item.setAttribute("id", "contentAreaContextMenu-zotero-zutilo-attach");
		item.setAttribute("oncommand", "alert('woo');");
		popup.appendChild(item);
		menu = document.getElementById("contentAreaContextMenu");
		menu.addEventListener("popupshowing", Zotero.Zutilo.contextPopup, false);
		
		//Add event listener to disable items in Zotero item menu popup when they can not be used
		menu = document.getElementById("zotero-itemmenu");
		menu.addEventListener("popupshowing", function() {
			Zotero.Zutilo.zoteroItemPopup(Zotero);
		}, false);
		
		//Add event listener to disable items in Zutilo popup menu of Zotero item popup menu
		menu = document.getElementById("zutilo-zotero-itemmenu");
		menu.addEventListener("popupshowing", function() {
			Zotero.Zutilo.zutiloItemPopup(Zotero);
		}, false);
	},
	
	contextPopup: function () {
	
		menuitem = document.getElementById("contentAreaContextMenu-zotero-zutilo-attach");
	
		if (window.gContextMenu.onLink) {
			menuitem.hidden = false;
		}
		else {
			menuitem.hidden = true;
		}	
		
		//Permanently hiding this for the moment because the attach function has not been
		//written yet
		menuitem.hidden = true;
	},
    
    copyCreators: function() {
        
        var win = this.wm.getMostRecentWindow("navigator:browser");
        var zitems = win.ZoteroPane.getSelectedItems();
        
        if (!zitems.length) {
			win.alert("Please select at least one item.");
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
        var zitems = win.ZoteroPane.getSelectedItems();
        
        if (!zitems.length) {
			win.alert("Please select at least one item.");
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
    
    addToClipboard: function(clipboardText) {
        
        var str = Components.classes["@mozilla.org/supports-string;1"].
            createInstance(Components.interfaces.nsISupportsString);
        if (!str) return false;
        
        str.data = clipboardText;

        var trans = Components.classes["@mozilla.org/widget/transferable;1"].
              createInstance(Components.interfaces.nsITransferable);
        if (!trans) return false;

        trans.addDataFlavor("text/unicode");
        trans.setTransferData("text/unicode",str,clipboardText.length * 2);

        var clipid = Components.interfaces.nsIClipboard;
        var clip = Components.classes["@mozilla.org/widget/clipboard;1"].getService(clipid);
        if (!clip) return false;
        
        clip.setData(trans,null,clip.kGlobalClipboard);
        return true;
    },
    
    pasteTags: function() {
        
        var win = this.wm.getMostRecentWindow("navigator:browser");
        var zitems = win.ZoteroPane.getSelectedItems();
        
        if (!zitems.length) {
			win.alert("Please select at least one item.");
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
    },
    
    getFromClipboard: function() {

        var trans = Components.classes["@mozilla.org/widget/transferable;1"].
              createInstance(Components.interfaces.nsITransferable);
        if (!trans) return false;
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
    
    modifyAttachmentPaths: function() {
        
        var win = this.wm.getMostRecentWindow("navigator:browser");
        var zitems = win.ZoteroPane.getSelectedItems();
        
        if (!zitems.length) {
			win.alert("Please select at least one item.");
			return false;
		}
        
        var oldPath = prompt("Old partial path to attachments' directory to be replaced: ", "");
        var newPath = prompt("New partial path to be used for attachments with paths matching the old partial path: ", "");
        
        if ((oldPath == null) || (newPath == null)) {
        	return false;
        }
        
        var zitem;
        var attachArray = [];
        var zattachment;
        var attachPath;
        while (zitems.length > 0) {
        	zitem = zitems.shift();
        	
        	attachArray = zitem.getAttachments(false);
        	while (attachArray.length > 0) {
        		zattachment = Zotero.Items.get(attachArray.shift());
        		attachPath = zattachment.attachmentPath;
        		if (attachPath.search(oldPath) == 0) {
        			zattachment.attachmentPath = attachPath.replace(oldPath,newPath);
        		}
        	}
        }
    },
    
    relateItems: function() {
    	var win = this.wm.getMostRecentWindow("navigator:browser");
        var zitems = win.ZoteroPane.getSelectedItems();
        
        if (!zitems.length) {
			win.alert("Please select at least one item.");
			return false;
		}
		
		var ids = [];
		for (var ii = 0; ii<zitems.length; ii++) {
			ids[ii] = zitems[ii].id;
		}
		for (ii = 0; ii<zitems.length; ii++) {
			zitems[ii]._setRelatedItems(ids);
		}
    },
    
    showAttachmentPaths: function() {
        
        var win = this.wm.getMostRecentWindow("navigator:browser");
        var zitems = win.ZoteroPane.getSelectedItems();
        
        if (!zitems.length) {
			win.alert("Please select at least one item.");
			return false;
		}
               
        var zitem;
        var attachArray = [];
        var zattachment;
        var attachPath;
        while (zitems.length > 0) {
        	zitem = zitems.shift();
        	
        	attachArray = zitem.getAttachments(false);
        	while (attachArray.length > 0) {
        		zattachment = Zotero.Items.get(attachArray.shift());
        		alert(zattachment.attachmentPath);
        	}
        }
    },
    
    zoteroItemPopup: function(zot) {
    	var showMenuAndItems = true;
    	
    	var win = zot.Zutilo.wm.getMostRecentWindow("navigator:browser");
        var zitems = win.ZoteroPane.getSelectedItems();
        
        if (zitems.length == 0) {
        	showMenuAndItems = false;
        } else {
        	for each(var zitem in zitems) {
        		var itemType = zot.ItemTypes.getName(zitem.itemTypeID);
        		if (itemType == "attachment" || itemType == "note") {
        			showMenuAndItems = false;
        		}
        	}
        }
        
        menu = document.getElementById("zutilo-zotero-itemmenu");
        itemCopyTags = document.getElementById("zutilo-copy-tags");
        itemPasteTags = document.getElementById("zutilo-paste-tags");
		menu.disabled = !showMenuAndItems;
		itemCopyTags.disabled = !showMenuAndItems;
		itemPasteTags.disabled = !showMenuAndItems;
		
		showMultiSelectionItems = showMenuAndItems && (zitems.length > 1);
		itemRelate = document.getElementById("zutilo-relateitems");
		itemRelate.disabled = !showMultiSelectionItems;
    },
    
    zutiloItemPopup: function(zot) {
    	var showItems = true;
    	
    	var win = zot.Zutilo.wm.getMostRecentWindow("navigator:browser");
        var zitems = win.ZoteroPane.getSelectedItems();
        
        if (zitems.length < 2) {
        	showItems = false;
        }
        
        //The relateitems menu item was moved out of the popup.  I'm leaving this here
        //as a placeholder in case a future item of the popup requires a similar callback.
        //itemRelate = document.getElementById("zutilo-relateitems");
		//itemRelate.disabled = !showItems;
    }
};

// Initialize the utility
window.addEventListener('load', function(e) { Zotero.Zutilo.init(); }, false);

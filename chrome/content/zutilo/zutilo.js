Zotero.Zutilo = {
	DB: null,
	
	init: function () {
        this.wm = Components.classes["@mozilla.org/appshell/window-mediator;1"]
				.getService(Components.interfaces.nsIWindowMediator);

	},
    
    copyCreators: function() {
        
        var win = this.wm.getMostRecentWindow("navigator:browser");
        var zitems = win.ZoteroPane.getSelectedItems();
        
        if (!zitems.length) {
			win.alert("Please select at least one item.");
			return;
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
			return;
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
        if (!str) {
            return false;
        }
        str.data = clipboardText;

        var trans = Components.classes["@mozilla.org/widget/transferable;1"].
              createInstance(Components.interfaces.nsITransferable);
        if (!trans) {
            return false;
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
    }
};

// Initialize the utility
window.addEventListener('load', function(e) { Zotero.Zutilo.init(); }, false);

/* Copyright 2012 Will Shanks.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
 
 //Note: this code has been adapted from dorando's Keyconfig extension.
 "use strict";
 Components.utils.import("resource://gre/modules/Services.jsm");

var gPrefService = Components.classes['@mozilla.org/preferences-service;1']
                   .getService(Components.interfaces.nsIPrefService).getBranch("");

var keyTree, gEditbox, gEdit;
var gKeys = [];

var gLocaleKeys;
var gPlatformKeys = new Object();
var gVKNames = [];

var gKeynames = {
	"BrowserReload();": Zutilo._bundle.GetStringFromName("zutilo.shortcuts.reload"),
	goBackKb2: Zutilo._bundle.GetStringFromName("zutilo.shortcuts.goBack"),
	goForwardKb2: Zutilo._bundle.GetStringFromName("zutilo.shortcuts.goForward")
}
gKeynames["BrowserReloadSkipCache();"] = 
	gKeynames["Browser:ReloadSkipCache"] = 
	Zutilo._bundle.GetStringFromName("zutilo.shortcuts.reloadSkipCache");
if (gPrefService.getPrefType("browser.backspace_action")) {
	if (gPrefService.getIntPref("browser.backspace_action") == 0) {
		gKeynames["cmd_handleBackspace"] = 
			Zutilo._bundle.GetStringFromName("zutilo.shortcuts.goBack");
		gKeynames["cmd_handleShiftBackspace"] = 
			Zutilo._bundle.GetStringFromName("zutilo.shortcuts.goForward");
	}
}

function keyconfig_onLoad() {
	keyTree = document.getElementById("key-tree");
	gEditbox = document.getElementById("editbox");
	gEdit = document.getElementById("edit");
	gLocaleKeys = document.getElementById("localeKeys");

	var platformKeys = document.getElementById("platformKeys");
	gPlatformKeys.shift = platformKeys.getString("VK_SHIFT");
	gPlatformKeys.meta  = platformKeys.getString("VK_META");
	gPlatformKeys.alt   = platformKeys.getString("VK_ALT");
	gPlatformKeys.ctrl  = platformKeys.getString("VK_CONTROL");
	gPlatformKeys.sep   = platformKeys.getString("MODIFIER_SEPARATOR");
	switch (gPrefService.getIntPref("ui.key.accelKey")){
		case 17:  
			gPlatformKeys.accel = gPlatformKeys.ctrl; 
			break;
		case 18:  
			gPlatformKeys.accel = gPlatformKeys.alt; 
			break;
		case 224: 
			gPlatformKeys.accel = gPlatformKeys.meta; 
			break;
		default:  
			gPlatformKeys.accel = (window.navigator.platform.search("Mac") == 0 ? 
				gPlatformKeys.meta : gPlatformKeys.ctrl);
	}

	for (var property in KeyEvent) {
		gVKNames[KeyEvent[property]] = property.replace("DOM_","");
	}
	gVKNames[8] = "VK_BACK";

	for (var shortcut in Zutilo.keys.shortcuts) {
		gKeys.push(shortcut);
	}
	
	 var elem = keyTree.getElementsByAttribute("sortActive","true")[0] || 
	 	document.getElementById("shortcut-name");

	gKeys.sort(sorter[elem.id]);
	if(elem.getAttribute("sortDirection") == "descending") gKeys.reverse();

	keyTree.view = keyView;
	keyTree.view.selection.select(-1);

	gEditbox.setAttribute("disabled","true");
	gEdit.value = "";
	gEdit.key = {modifiers: '', key: '', keycode: ''};
}

function formatKey(key) {
	if (key.modifiers == "shift,alt,control,accel" && key.keycode == "VK_SCROLL_LOCK") {
		return Zutilo._bundle.GetStringFromName("zutilo.shortcuts.disabled");
	}
	if (!key.key && !key.keycode) {
		return Zutilo._bundle.GetStringFromName("zutilo.shortcuts.disabled");
	}

	var val = "";
	if (key.modifiers) {
		val = key.modifiers
			.replace(/^[\s,]+|[\s,]+$/g,"").split(/[\s,]+/g).join(gPlatformKeys.sep)
			.replace("alt",gPlatformKeys.alt)
			.replace("shift",gPlatformKeys.shift)
			.replace("control",gPlatformKeys.ctrl)
			.replace("meta",gPlatformKeys.meta)
			.replace("accel",gPlatformKeys.accel)
			+gPlatformKeys.sep;
	}
	
	if (key.key == " ") {
		key.key = ""; key.keycode = "VK_SPACE";
	}
	if (key.key) {
		val += key.key;
	}
	if (key.keycode) {
		try {
			val += gLocaleKeys.getString(key.keycode)
		} catch(e) {
			var unrecognizedStr = 
				Zutilo._bundle.GetStringFromName("zutilo.shortcuts.unrecognized");
			val += unrecognizedStr.replace("$1",key.keycode);
		}
	}

	return val;
}

function getFormattedKey(keyLabel) {
	return formatKey(Zutilo.keys.getKey(keyLabel))
}

function Recognize(event) {
	event.preventDefault();
	event.stopPropagation();

	var modifiers = [];
	if (event.altKey) {
		modifiers.push("alt");
	}
	if (event.ctrlKey) {
		modifiers.push("control");
	}
	if (event.metaKey) {
		modifiers.push("meta");
	}
	if (event.shiftKey) {
		modifiers.push("shift");
	}

	modifiers = modifiers.join(" ");

	var key = null; 
	var keycode = null;
	if (event.charCode) {
		key = String.fromCharCode(event.charCode).toUpperCase();
	} else { 
		keycode = gVKNames[event.keyCode]; 
		if (!keycode) {
			return
		}
	}

	gEdit.key = {
		modifiers: modifiers,
		key: key,
		keycode: keycode
	};
	gEdit.value = formatKey(gEdit.key);

	gEdit.nextSibling.focus();
}

function Apply() {
	var key = Zutilo.keys.getKey(gKeys[keyTree.currentIndex]);

	keyTree.focus();

	if (!Zutilo.keys.keysEqual(key, gEdit.key) && noConflictingKeys(gEdit.key)) {
		Zutilo.keys.setKey(gKeys[keyTree.currentIndex], gEdit.key);
		keyTree.treeBoxObject.invalidate();
	}
}

function Disable() {
	gEdit.value = Zutilo._bundle.GetStringFromName('zutilo.shortcuts.disabled');
	gEdit.key = {modifiers: '', key: '', keycode: ''};
	Apply();
}

function noConflictingKeys(checkKey) {
	// Use object properties to store key names so there are no duplicates
	var conflicts = new Object();
	var keyLists, win;
	
	// Loop through all browsers looking for keys, though they probably all have the 
	// same ones....
	var windows = Services.wm.getEnumerator('navigator:browser');
	while (windows.hasMoreElements()) {
		win = windows.getNext();
		
		// Get all key elements that match key/keycode
		keyLists=[];
		if (checkKey.key) {
			keyLists.push(win.document.getElementsByAttribute('key', 
				checkKey.key.toLowerCase()));
			keyLists.push(win.document.getElementsByAttribute('key', 
				checkKey.key.toUpperCase()));
		} else if (checkKey.keycode) {
			keyLists.push(win.document.getElementsByAttribute('keycode', 
				checkKey.keycode));
		}
	
		// Get name of each key with matching modifiers and key/keycode
		for (var listIdx=0; listIdx<keyLists.length; listIdx++) {
			for (var keyIdx=0; keyIdx<keyLists[listIdx].length; keyIdx++) {
				if (modifiersMatch(checkKey, keyLists[listIdx].item(keyIdx))) {
					conflicts[getNameForKey(win, keyLists[listIdx].item(keyIdx))]=true;
				}
			}
		}
	}
	
	var nameList=[];
	for (var name in conflicts) {
		nameList.push(name);
	}
	
	var noConflict = true;
	if (nameList.length>0) {
		// OK = no conflict; cancel = conflict
		noConflict=Services.prompt.confirm(window, 
			Zutilo._bundle.GetStringFromName("zutilo.shortcuts.conflicts.promptTitle"),
			Zutilo._bundle.GetStringFromName("zutilo.shortcuts.conflicts.promptText")
			+ nameList.join('\n'));
	}
	
	return noConflict
}

function modifiersMatch(keyElem, keyNode) {
	var modifiers1=keyElem.modifiers
						.replace("alt",gPlatformKeys.alt)
  						.replace("shift",gPlatformKeys.shift)
  						.replace("control",gPlatformKeys.ctrl)
  						.replace("meta",gPlatformKeys.meta)
  						.replace("accel",gPlatformKeys.accel)
						.split(/[\s,]+/);
	var modifiers2=keyNode.getAttribute('modifiers')
						.replace("alt",gPlatformKeys.alt)
  						.replace("shift",gPlatformKeys.shift)
  						.replace("control",gPlatformKeys.ctrl)
  						.replace("meta",gPlatformKeys.meta)
  						.replace("accel",gPlatformKeys.accel)
						.split(/[\s,]+/);
	
	var match=true;
	if (modifiers1.length==modifiers2.length) {
		for (var idx=0; idx<modifiers1.length; idx++) {
			if (modifiers2.indexOf(modifiers1[idx])==-1) {
				match=false;
				break
			}
		}
	} else {
		match=false;
	}
	
	return match
}

function getNameForKey(win, keyNode) {
	var val;

	if (keyNode.hasAttribute("label")) {
		return keyNode.getAttribute("label")
	}

	if (keyNode.hasAttribute("command") || keyNode.hasAttribute("observes")) {
		var command = keyNode.getAttribute("command") || keyNode.getAttribute("observes");
		var node = win.document.getElementById(command);
		if (node && node.hasAttribute("label")) {
			return node.getAttribute("label")
		}
		val = getLabel(win, "command", command);
		if (!val) {
			val = getLabel(win, "observes", command)
		}
	}

	var id = keyNode.getAttribute('id');
	if (!val && id) {
		val = getLabel(win, "id", id);
	}

	// Code below copied from Keyconfig -- kept for compatibility with Keyconfig shortcuts
	if (!val) {
		var val = id.replace(/xxx_key.+?_/,"");
		
		try {
			var converter = 
				Components.classes['@mozilla.org/intl/scriptableunicodeconverter']
                .createInstance(Components.interfaces.nsIScriptableUnicodeConverter);
            converter.charset = "UTF-8";
			val = converter.ConvertToUnicode(val);
		} catch(err) {
			converter.charset = "UTF-8"; 
		}
		
		if (!val && command) {
			val = command;
		}

		if (gKeynames[val]) {
			var key = win.document.getElementById(gKeynames[val]);
			if (key) {
				val = getNameForKey(win, key);
			} else {
				val = gKeynames[val];
			}
		}
	}
	
	if (!val) {
		val = Zutilo._bundle.GetStringFromName('zutilo.shortcuts.unlabeled');
	}

	return val
}

function getLabel(win, attr, value) {
	var Users = win.document.getElementsByAttribute(attr,value);
	var User;

	for (var i = 0, l = Users.length; i < l; i++) {
		if (Users[i].hasAttribute("label") && (!User || User.localName == "menuitem")) {
			User = Users[i];
		}
	}

	var label;
	if (!User) {
		label = null;
	} else if (User.localName == "menuitem" && 
		User.parentNode.parentNode.parentNode.localName == "menupopup") {
		label = User.getAttribute("label") + 
			" [" + User.parentNode.parentNode.getAttribute("label") + "]";
	} else {
		label = User.getAttribute("label");
	}
	
	return label
}

var sorter = new Object();
sorter['shortcut-name'] = function(a,b) { 
	var aName = Zutilo.keys.keyName(a);
	var bName = Zutilo.keys.keyName(b);
	return aName.localeCompare(bName); 
};
sorter['shortcut-value'] = function(a,b) {
	var aShortcut = getFormattedKey(a);
	var bShortcut = getFormattedKey(b);
	if (aShortcut == bShortcut) {
		return 0;
	} else if (!aShortcut) {
		return 1;
	} else if (!bShortcut) {
		return -1;
	} else if (aShortcut > bShortcut) {
		return 1;
	} else {
		return -1;
	}
};

var keyView = {
	get rowCount() {
		return gKeys.length;
	},
	getCellText: function(row,col) {
		switch (col.id) {
			case 'shortcut-name':
				return Zutilo.keys.keyName(gKeys[row])
			case 'shortcut-value':
			default:
				return getFormattedKey(gKeys[row])
		}
	},
	setTree: function(treebox) {
		this.treebox=treebox;
	},
	isContainer: function() {
		return false;
	},
	isSeparator: function() {
		return false;
	},
	isSorted: function() {
		return false;
	},
	getLevel: function() {
		return 0;
	},
	getImageSrc: function () {
		return null;
	},
	getRowProperties: function(row, prop) {},
	canDropBeforeAfter: function() { 
		return false; 
	},
	canDrop: function() { 
		return false; 
	},
	getParentIndex: function() {
		return -1;
	},

	getCellProperties: function(row,col,props) {},
	getColumnProperties: function() {},
	selectionChanged: function() {
		var keyLabel = gKeys[this.selection.currentIndex];

		if (!keyLabel) {
			return;
		}
		
		if (gEditbox.hasAttribute("disabled")) {
			gEditbox.removeAttribute("disabled");
		}
		
		gEdit.key = Zutilo.keys.getKey(keyLabel);
		gEdit.value = getFormattedKey(keyLabel);
	},
	cycleHeader: function cycleHeader(col, elem) {
		if (col.id) {
			elem = col.element;
		}

		var direction = elem.getAttribute("sortDirection") == "ascending" ? 
			"descending" : "ascending";
		var columns = this.treebox.firstChild.childNodes;
		for (var i = 0, l = columns.length; i < l; i++) {
			columns[i].setAttribute("sortDirection","none");
			columns[i].setAttribute("sortActive",false);
		}

		elem.setAttribute("sortDirection",direction);
		elem.setAttribute("sortActive",true);

		var currentRow = gKeys[this.selection.currentIndex];

		gKeys.sort(sorter[col.id || col]);
		if (direction == "descending") {
			gKeys.reverse();
		}

		this.treebox.invalidate();
		if (currentRow) {
			idx = -1;
			do { 
				idx++; 
			} while (currentRow != gKeys[idx]);
			this.selection.select(idx);
			this.treebox.ensureRowIsVisible(idx);
		}
	}
}

/* Copyright 2012 Will Shanks.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
 
 //Note: this code has been adapted from dorando's Keyconfig extension.

var gPrefService = Components.classes['@mozilla.org/preferences-service;1']
                   .getService(Components.interfaces.nsIPrefService).getBranch("");

var keyTree, gEditbox, gEdit;
var gKeys = [];

var gLocaleKeys;
var gPlatformKeys = new Object();
var gVKNames = [];

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

	if (!Zutilo.keys.keysEqual(key, gEdit.key)) {
		Zutilo.keys.setKey(gKeys[keyTree.currentIndex], gEdit.key);
		keyTree.treeBoxObject.invalidate();
	}
}

function Disable() {
	gEdit.value = Zutilo._bundle.GetStringFromName('zutilo.shortcuts.disabled');
	gEdit.key = {modifiers: '', key: '', keycode: ''};
	Apply();
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

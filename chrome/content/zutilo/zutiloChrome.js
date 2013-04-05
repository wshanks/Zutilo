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

///////////////////////////////////////////
// Initialization
///////////////////////////////////////////
// Array holding all root XUL elements (those whose parents are not Zutilo elements).
ZutiloChrome.XULRootElements = [];

ZutiloChrome.init = function () {
	window.setTimeout(function() {
			if (typeof ZutiloChrome != 'undefined') {
				ZutiloChrome.showUpgradeMessage();
			}
		}, 500);
};

ZutiloChrome.showUpgradeMessage = function() {
	var lastVersion = Zutilo.Prefs.get('lastVersion');
	
	AddonManager.getAddonByID(Zutilo.id,
		function(aAddon) {
			if (lastVersion != aAddon.version) {
				Zutilo.Prefs.set('lastVersion',aAddon.version);
				
				//lastVersion == '' for new install.  Don't show upgrade message
				//to new users
				var upgradeMessageStr = Zutilo._bundle.
							GetStringFromName("zutilo.startup.upgrademessage");
				if (lastVersion != '' && upgradeMessageStr != '') {
					window.openDialog('chrome://zutilo/content/zutiloUpgraded.xul', 
						'zutilo-startup-upgradewindow', 'chrome,centerscreen',
						{upgradeMessage: upgradeMessageStr});
				}
			}
		}
	);
};

///////////////////////////////////////////
// UI functions
///////////////////////////////////////////

// Open Zutilo preferences window
ZutiloChrome.openPreferences = function () {
	if (null == this._preferencesWindow || this._preferencesWindow.closed) {
		var featureStr='chrome,titlebar,toolbar=yes,resizable,centerscreen,';
		var modalStr = Services.prefs.getBoolPref('browser.preferences.instantApply') 
			? 'dialog=no' : 'modal';
		featureStr=featureStr+modalStr;
		
		this._preferencesWindow = 
			window.openDialog('chrome://zutilo/content/preferences.xul',
			'zutilo-prefs-window',featureStr);
	}
	
	this._preferencesWindow.focus();
};

//////////////////////////////////////////////
// XUL related functions
//////////////////////////////////////////////

// Remove all root XUL elements in this.XULRootElements array
ZutiloChrome.removeXUL = function() {
	while (this.XULRootElements.length > 0) {
		var elem = document.getElementById(this.XULRootElements.pop());
		
		if (elem) {
			elem.parentNode.removeChild(elem);
		}
	}
};

/* Remove all descendants of parentElem whose ids begin with childLabel
   This function is useful for removing XUL that is added to elements (like menu popups) 
   that periodically stripped of their children and recreated.  This repopulating  
   (outside of Zutilo) makes it difficult to keep the XULRootElements updated with 
   the current set of children that Zutilo has added to the element.  Rather than trying 
   to search XULRootElements each time a Zutilo function repopulates such an element to 
   weed out removed elements and add new ones, we just search the parent for children 
   partial id's that should be unique to Zutilo and remove those. */
ZutiloChrome.removeLabeledChildren = function(parentElem,childLabel) {
	var elemChildren = parentElem.childNodes;

	for (var index=0;index<elemChildren.length;) {
		if ("string" == typeof(elemChildren[index].id) && 
				elemChildren[index].id.indexOf(childLabel) == 0) {
			parentElem.removeChild(elemChildren[index]);
		} else {
			this.removeLabeledChildren(elemChildren[index],childLabel);
			index++;
		}
	}
};
	
///////////////////////////////////////////
// Utility functions
///////////////////////////////////////////

// Get string from clipboard
ZutiloChrome.getFromClipboard = function() {

	var trans = Components.classes["@mozilla.org/widget/transferable;1"].
		  createInstance(Components.interfaces.nsITransferable);
	if ('init' in trans) {
		trans.init(window.QueryInterface(Components.interfaces.nsIInterfaceRequestor).
			getInterface(Components.interfaces.nsIWebNavigation));
	}
	trans.addDataFlavor("text/unicode");
	
	Services.clipboard.getData(trans,Services.clipboard.kGlobalClipboard);
	
	var str = new Object();
	var strLength = new Object();
	
	try {
		trans.getTransferData("text/unicode", str, strLength);
	} catch (err) {
		var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].
			getService(Components.interfaces.nsIPromptService);
		prompts.alert(null,Zutilo._bundle.
			GetStringFromName("zutilo.error.pastetitle"),
			Zutilo._bundle.
			GetStringFromName("zutilo.error.pastemessage"));
		return '';
	}
	
	if (str) {
		var pasteText = str.value.
			QueryInterface(Components.interfaces.nsISupportsString).data;
	} else {
		var pasteText='';
	}
	
	return pasteText;
};
/* Copyright 2012 Will Shanks.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
 
"use strict";
//////////////////////////////////////////////
// Include core modules and built-in modules
//////////////////////////////////////////////

Components.utils.import("resource://gre/modules/Services.jsm");
Components.utils.import("chrome://zutilo/content/zutilo.jsm");

///////////////////////////////////////////
// General overlay
///////////////////////////////////////////

// General functions needed by Firefox and Zotero overlays

/**
 * ZutiloChrome namespace.
 */
if ("undefined" == typeof(ZutiloChrome)) {
  window.ZutiloChrome = {};
};

ZutiloChrome.showUpgradeMessage = function() {
	if (Zutilo.upgradeMessage != '') {
		var upgradeWindow = 
			window.openDialog('chrome://zutilo/content/zutiloUpgraded.xul', 
			'zutilo-startup-upgradewindow', 'chrome,centerscreen',
			{upgradeMessage: Zutilo.upgradeMessage});
		
		//Clear message so it is not shown again on this run
		Zutilo.upgradeMessage = '';
	}
};

// Open Zutilo preferences window
ZutiloChrome.openPreferences = function () {
	if (null == this._preferencesWindow || this._preferencesWindow.closed) {
		var featureStr='chrome,titlebar,toolbar=yes,resizable,centerscreen,';
		var modalStr = Zutilo.Prefs.get('browser.preferences.instantApply', true) 
			? 'dialog=no' : 'modal';
		featureStr=featureStr+modalStr;
		
		this._preferencesWindow = 
			window.openDialog('chrome://zutilo/content/preferences.xul',
			'zutilo-prefs-window',featureStr);
	}
	
	this._preferencesWindow.focus();
};
	
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
/* Copyright 2012 Will Shanks.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
 
///////////////////////////////////////////
// Include core modules
///////////////////////////////////////////

Components.utils.import("chrome://zutilo/content/zutilo.jsm");

///////////////////////////////////////////
// General overlay
///////////////////////////////////////////

// General functions needed by Firefox and Zotero overlays

/**
 * ZutiloChrome namespace.
 */
if ("undefined" == typeof(ZutiloChrome)) {
  var ZutiloChrome = {};
};

ZutiloChrome.showUpgradeMessage = function() {
	if (Zutilo.upgradeMessage != '') {
		upgradeWindow = 
			window.openDialog('chrome://zutilo/content/zutiloUpgraded.xul', 
			'zutilo-startup-upgradewindow', 'chrome',
			{upgradeMessage: Zutilo.upgradeMessage});
			
		//Clear message so it is not shown again on this run
		Zutilo.upgradeMessage = '';
	}
};

// Open Zutilo preferences window
ZutiloChrome.openPreferences = function (paneID, action) {
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

	var clip = Components.classes["@mozilla.org/widget/clipboard;1"].
		getService(Components.interfaces.nsIClipboard);
	if (!clip) return false;
	
	clip.getData(trans,clip.kGlobalClipboard);
	
	var str = new Object();
	var strLength = new Object();
	
	trans.getTransferData("text/unicode", str, strLength);
	
	if (str) {
		pasteText = str.value.
			QueryInterface(Components.interfaces.nsISupportsString).data;
	} else {
		pasteText='';
	}
	
	return pasteText;
};
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

ZutiloChrome.generalOverlay = {
	showUpgradeMessage: function() {
		if (Zutilo.upgradeMessage != '') {
			upgradeWindow = 
				window.openDialog('chrome://zutilo/content/zutiloUpgraded.xul', 
				'zutilo-startup-upgradewindow', 'chrome',
				{upgradeMessage: Zutilo.upgradeMessage});
				
			//Clear message so it is not shown again on this run
			Zutilo.upgradeMessage = '';
		}
	}
};
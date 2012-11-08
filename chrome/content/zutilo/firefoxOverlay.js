/* Copyright 2012 Will Shanks.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
 
///////////////////////////////////////////
// Firefox start up
///////////////////////////////////////////
Components.utils.import("resource://gre/modules/AddonManager.jsm");

Components.utils.import("resource://zutilomodules/zutilo.jsm");
Components.utils.import("resource://zutilomodules/preferences.jsm");

AddonManager.getAddonByID(Zutilo.zoteroID,function(aAddon) {
	if (aAddon) {
		Zutilo.zoteroActive=aAddon.isActive;
	} else {
		Zutilo.zoteroActive=false;
	}
	
	var showWarn = Zutilo.Prefs.get('warnZoteroNotActive');
	
	if (!Zutilo.zoteroActive && showWarn) {
		window.openDialog('chrome://zutilo/content/zoteroNotActive.xul', 
			'zutilo-zoteroNotActive-window', 'chrome');
	}
});

///////////////////////////////////////////
// Firefox overlay
///////////////////////////////////////////

// Not added yet
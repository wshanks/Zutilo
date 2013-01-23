/* Copyright 2012 Will Shanks.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";
///////////////////////////////////////////
// Include used modules
///////////////////////////////////////////

Components.utils.import("resource://gre/modules/AddonManager.jsm");

///////////////////////////////////////////
// Include core modules
///////////////////////////////////////////

Components.utils.import("chrome://zutilo/content/zutilo.jsm");

///////////////////////////////////////////
// Firefox overlay
///////////////////////////////////////////

/**
 * ZutiloChrome namespace.
 */
if ("undefined" == typeof(ZutiloChrome)) {
  window.ZutiloChrome = {};
};

ZutiloChrome.firefoxOverlay = {
	init: function() {
		this.checkZoteroActive();
		
		window.setTimeout(function() { ZutiloChrome.showUpgradeMessage(); }, 500);
	},
	
	checkZoteroActive: function() {

		AddonManager.getAddonByID(Zutilo.zoteroID,function(aAddon) {
			if (aAddon) {
				Zutilo.zoteroActive=aAddon.isActive;
			} else {
				Zutilo.zoteroActive=false;
			}
			
			var showWarn = Zutilo.Prefs.get('warnZoteroNotActive');
			
			if (!Zutilo.zoteroActive && showWarn) {
				window.openDialog('chrome://zutilo/content/zoteroNotActive.xul', 
					'zutilo-zoteroNotActive-window', 'chrome,centerscreen');
			}
		});
	}
};

///////////////////////////////////////////
// Firefox start up
///////////////////////////////////////////
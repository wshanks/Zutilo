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
ZutiloChrome.firefoxOverlay = {
	init: function() {
		Zutilo.checkZoteroActiveAndCallIf(false,this,this.warnZoteroNotActive);
		
		window.setTimeout(function() {
			if (typeof ZutiloChrome != 'undefined') {
				ZutiloChrome.showUpgradeMessage();
			}
		}, 500);
	},
	
	warnedThisSession: false,
	
	warnZoteroNotActive: function() {
		var showWarn = Zutilo.Prefs.get('warnZoteroNotActive');
		
		if (showWarn && !this.warnedThisSession) {
			window.openDialog('chrome://zutilo/content/zoteroNotActive.xul', 
				'zutilo-zoteroNotActive-window', 'chrome,centerscreen');
			this.warnedThisSession = true;
		}
	}
};

///////////////////////////////////////////
// Firefox start up
///////////////////////////////////////////
/* Copyright 2012 Will Shanks.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";
///////////////////////////////////////////
// Include core modules
///////////////////////////////////////////
Components.utils.import("chrome://zutilo/content/zutilo.jsm");

///////////////////////////////////////////
// Firefox overlay
///////////////////////////////////////////
ZutiloChrome.firefoxOverlay = {
	init: function() {
		window.setTimeout(function() {
			if (typeof ZutiloChrome != 'undefined') {
				Zutilo.checkZoteroActiveAndCallIf(false,ZutiloChrome.firefoxOverlay,
					ZutiloChrome.firefoxOverlay.warnZoteroNotActive);
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
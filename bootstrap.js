/* Copyright 2012 Will Shanks.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

Components.utils.import("resource://gre/modules/Services.jsm");

const BOOTSTRAP_REASONS = [
    "", // the bootstrap reason is 1 based
    "APP_STARTUP",
    "APP_SHUTDOWN",
    "ADDON_ENABLE",
    "ADDON_DISABLE",
    "ADDON_INSTALL",
    "ADDON_UNINSTALL",
    "ADDON_UPGRADE",
    "ADDON_DOWNGRADE"
];

function install(data, reason) {
	
}

function startup(data, reason) {
	Components.utils.import("chrome://zutilo/content/zutilo.jsm");
	Zutilo.init();
}

function shutdown(data, reason) {
	if (reason == APP_SHUTDOWN) {
		return;
	}
	
	Zutilo.shutdown();
	Components.utils.unload("chrome://zutilo/content/zutilo.jsm");
}

function uninstall(data, reason) {
	
}
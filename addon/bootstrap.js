/* Copyright 2012 Will Shanks.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";
/* global Components, Services */
/* global Zutilo, APP_SHUTDOWN */
const {classes: Cc, utils: Cu} = Components;

Cu.import("resource://gre/modules/Services.jsm");

// eslint-disable-next-line no-unused-vars
function install(data, reason) {

}

// eslint-disable-next-line no-unused-vars
function startup(data, reason) {
    Cu.import("chrome://zutilo/content/zutilo.js");
    Zutilo.init();
}

// eslint-disable-next-line no-unused-vars
function shutdown(data, reason) {
    if (reason == APP_SHUTDOWN) {
        return;
    }

    var windows = Services.wm.getEnumerator('navigator:browser');
    while (windows.hasMoreElements()) {
        var tmpWin=windows.getNext();

        tmpWin.ZutiloChrome.removeXUL();
        if (typeof tmpWin.ZutiloChrome.zoteroOverlay != 'undefined') {
            tmpWin.ZutiloChrome.zoteroOverlay.unload();
        }
        delete tmpWin.ZutiloChrome;
        delete tmpWin.Zutilo;
    }

    Zutilo.cleanup();

    Cc["@mozilla.org/intl/stringbundle;1"].
        getService(Components.interfaces.nsIStringBundleService).flushBundles();

    Cu.unload("chrome://zutilo/content/zutilo.js");
}

// eslint-disable-next-line no-unused-vars
function uninstall(data, reason) {

}

/* Copyright 2012 Will Shanks.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";
/* global Components, Services */
/* global Zutilo, APP_SHUTDOWN */
const {classes: Cc, utils: Cu} = Components;
var chromeHandle
var Zutilo


// eslint-disable-next-line no-unused-vars
function install(data, reason) {

}

// eslint-disable-next-line no-unused-vars
function startup(data, reason) {
    let aomStartup = Cc["@mozilla.org/addons/addon-manager-startup;1"].getService(Ci.amIAddonManagerStartup)
    let manifestURI = Services.io.newURI(data.rootURI + "manifest.json");
    chromeHandle = aomStartup.registerChrome(manifestURI, [
        ["content", "zutilo", "chrome/content/zutilo/"],
        ["locale",  "zutilo", "en-US", "chrome/locale/en-US/zutilo/"],
        ["locale",  "zutilo", "de", "chrome/locale/de/zutilo/"],
        ["locale",  "zutilo", "es", "chrome/locale/es/zutilo/"],
        ["locale",  "zutilo", "fr", "chrome/locale/fr/zutilo/"],
        ["locale",  "zutilo", "zh-CN", "chrome/locale/zh-CN/zutilo/"]
    ])

    // Kept at file level: shutdown() needs it too
    Zutilo = ChromeUtils.importESModule("chrome://zutilo/content/zutilo.mjs").Zutilo;
    Zutilo.init(data.rootURI, Zotero);
}

// eslint-disable-next-line no-unused-vars
function shutdown(data, reason) {
    if (reason == APP_SHUTDOWN) {
        return;
    }

    var windows = Services.wm.getEnumerator('navigator:browser');
    while (windows.hasMoreElements()) {
        var tmpWin=windows.getNext();

        if (typeof tmpWin.ZutiloChrome == 'undefined') {
            continue;
        }
        tmpWin.ZutiloChrome.removeXUL();
        if (typeof tmpWin.ZutiloChrome.zoteroOverlay != 'undefined') {
            tmpWin.ZutiloChrome.zoteroOverlay.unload();
        }
        delete tmpWin.ZutiloChrome;
        // `var { Zutilo }` of the window scripts: not configurable, so a
        // delete throws in strict mode and stopped the shutdown here
        try {
            tmpWin.Zutilo = undefined;
        } catch (e) {}
    }

    Zutilo.cleanup();
    chromeHandle.destruct()
    chromeHandle = null

    Cc["@mozilla.org/intl/stringbundle;1"].
        getService(Components.interfaces.nsIStringBundleService).flushBundles();
}

// eslint-disable-next-line no-unused-vars
function uninstall(data, reason) {

}

/* Copyright 2012 Will Shanks.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';
/* global window, document, Components */
/* global Zutilo */
Components.utils.import('chrome://zutilo/content/zutilo.jsm');

// eslint-disable-next-line no-unused-vars
function onAccept() {
    if (document.getElementById('zutilo-zoteronotactive-zoteropage').checked) {
        Zutilo.openLink('http://www.zotero.org/');
    }

    if (document.getElementById('zutilo-zoteronotactive-addonmanager').
            checked) {
        window.opener.BrowserOpenAddonsMgr();
    }

    if (document.getElementById('zutilo-zoteronotactive-dontshow').checked) {
        Zutilo.Prefs.set('warnZoteroNotActive', false);
    }

    return true;
}

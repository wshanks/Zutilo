/* Copyright 2012 Will Shanks.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';
/* global window, document, Components */
Components.utils.import('chrome://zutilo/content/zutilo.js');

function upgradeInit() {
    var upgradeDescription = document.
        getElementById('zutilo-startup-upgradedescription');
    upgradeDescription.textContent = window.arguments[0].upgradeMessage;
}

window.addEventListener('load', function(_e) {
        upgradeInit();
    }, false);

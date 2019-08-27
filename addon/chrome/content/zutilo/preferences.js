/* Copyright 2012 Will Shanks.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';
/* global window, document, Components */
/* global keyconfigOnLoad, Zutilo */
Components.utils.import('chrome://zutilo/content/zutilo.js');

// eslint-disable-next-line no-unused-vars
function initializePrefWindow() {
    keyconfigOnLoad();
}

// eslint-disable-next-line no-unused-vars
function buildMenuPrefs() {
    for (const menuName of ['item', 'collection']) {
        for (const functionName of Zutilo._menuFunctions[menuName]) {
            addMenuPreference(menuName, functionName);
            addMenuRadiogroup(menuName, functionName);
        }
    }
}

function addMenuPreference(menuName, menuFunction) {
    var newPref = document.createElement('preference');
    newPref.setAttribute('id', `pref-${menuName}menu-${menuFunction}`);
    newPref.setAttribute('name', `extensions.zutilo.${menuName}menu.${menuFunction}`);
    newPref.setAttribute('type', 'string');

    var zutiloPrefs = document.getElementById('zutilo-prefpane-ui-preferences');
    zutiloPrefs.appendChild(newPref);
}

function addMenuRadiogroup(menuName, menuFunction) {
    var newRow = document.createElement('row');

    var newHbox = document.createElement('hbox');
    newHbox.setAttribute('align', 'center');
    var newLabel = document.createElement('label');
    newLabel.setAttribute('value', Zutilo._bundle.GetStringFromName(
        `zutilo.preferences.${menuName}menu.${menuFunction}`));
    newHbox.appendChild(newLabel);
    newRow.appendChild(newHbox);

    var newRadiogroup = document.createElement('radiogroup');
    newRadiogroup.setAttribute('orient', 'horizontal');
    newRadiogroup.setAttribute('align', 'center');
    newRadiogroup.setAttribute('preference',
                               `pref-${menuName}menu-${menuFunction}`);

    var newRadio;
    for (const label of ['Zotero', 'Zutilo', 'Hide']) {
        newRadio = document.createElement('radio');
        newRadio.setAttribute('label', Zutilo._bundle.GetStringFromName(
            `zutilo.preferences.${menuName}menu.${label}`));
        newRadio.setAttribute('value', label);
        newRadiogroup.appendChild(newRadio);
    }

    newRow.appendChild(newRadiogroup);

    var menuRows = document.getElementById(`zutilo-prefpane-${menuName}-rows`);
    menuRows.appendChild(newRow);
}

// eslint-disable-next-line no-unused-vars
function showReadme() {
    window.openDialog('chrome://zutilo/content/readme.xul',
        'zutilo-readme-window', 'chrome');
}

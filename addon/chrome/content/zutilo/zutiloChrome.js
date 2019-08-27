/* Copyright 2012 Will Shanks.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';
/* global window, document, AddonManager, Components, Services */
/* global Zutilo, ZutiloChrome */
/******************************************/
// Include core modules and built-in modules
var Cc = Components.classes
var Ci = Components.interfaces
var Cu = Components.utils
Cu.import('resource://gre/modules/AddonManager.jsm');
Cu.import('resource://gre/modules/Services.jsm');
Cu.import('chrome://zutilo/content/zutilo.js');

/******************************************/
// Initialization
/******************************************/
// Array holding all root XUL elements (those whose parents are not Zutilo
// elements).
ZutiloChrome.XULRootElements = [];

ZutiloChrome.init = function() {
    window.setTimeout(function() {
            if (typeof ZutiloChrome != 'undefined') {
                ZutiloChrome.showUpgradeMessage();
            }
        }, 500);
};

ZutiloChrome.showUpgradeMessage = function() {
    var lastVersion = Zutilo.Prefs.get('lastVersion');

    AddonManager.getAddonByID(Zutilo.id,
        function(aAddon) {
            if (lastVersion != aAddon.version) {
                Zutilo.Prefs.set('lastVersion', aAddon.version);

                // lastVersion == '' for new install.  Don't show upgrade
                // message to new users
                var upgradeMessageStr = Zutilo._bundle.
                            GetStringFromName('zutilo.startup.upgrademessage');
                if (lastVersion !== '' && upgradeMessageStr !== '') {
                    window.openDialog(
                        'chrome://zutilo/content/zutiloUpgraded.xul',
                        'zutilo-startup-upgradewindow', 'chrome, centerscreen',
                        {upgradeMessage: upgradeMessageStr});
                }
            }
        }
    );
};

/******************************************/
// UI functions
/******************************************/

// Open Zutilo preferences window
ZutiloChrome.openPreferences = function() {
    if (!('_preferencesWindow' in this) || this._preferencesWindow === null ||
        this._preferencesWindow.closed) {
        var featureStr = 'chrome, titlebar, toolbar=yes, resizable, ' +
            'centerscreen, ';
        var modalStr = Services.prefs.
            getBoolPref('browser.preferences.instantApply')?
            'dialog=no' : 'modal';
        featureStr = featureStr + modalStr;

        this._preferencesWindow =
            window.openDialog('chrome://zutilo/content/preferences.xul',
            'zutilo-prefs-window', featureStr);
    }

    this._preferencesWindow.focus();
};

/******************************************/
// XUL related functions
/******************************************/

// Track XUL elements with ids elementIDs that were added to document doc, so
// that they may be removed on shutdown
ZutiloChrome.registerXUL = function(elementIDs, doc) {
    if (typeof doc.ZutiloXULRootElements == 'undefined') {
        doc.ZutiloXULRootElements = [];
    }

    var xulRootElements;
    if (doc == document) {
        xulRootElements = ZutiloChrome.XULRootElements;
    } else {
        xulRootElements = doc.ZutiloXULRootElements;
    }

    xulRootElements.push(elementIDs);
};

// Remove all root XUL elements from main document and any Zotero tab documents
ZutiloChrome.removeXUL = function() {
    this.removeDocumentXUL(document, this.XULRootElements);
};

ZutiloChrome.removeDocumentXUL = function(doc, XULRootElementIDs) {
    while (XULRootElementIDs.length > 0) {
        var elem = doc.getElementById(XULRootElementIDs.pop());

        if (elem) {
            elem.parentNode.removeChild(elem);
        }
    }
};

/* Remove all descendants of parentElem whose ids begin with childLabel
   This function is useful for removing XUL that is added to elements (like
   menu popups) that periodically stripped of their children and recreated.
   This repopulating (outside of Zutilo) makes it difficult to keep the
   XULRootElements updated with the current set of children that Zutilo has
   added to the element.  Rather than trying to search XULRootElements each
   time a Zutilo function repopulates such an element to weed out removed
   elements and add new ones, we just search the parent for children
   partial id's that should be unique to Zutilo and remove those. */
ZutiloChrome.removeLabeledChildren = function(parentElem, childLabel) {
    var elemChildren = parentElem.childNodes;

    for (var index = 0;index < elemChildren.length;) {
        if ('string' == typeof elemChildren[index].id &&
                elemChildren[index].id.indexOf(childLabel) === 0) {
            parentElem.removeChild(elemChildren[index]);
        } else {
            this.removeLabeledChildren(elemChildren[index], childLabel);
            index++;
        }
    }
};

/******************************************/
// Utility functions
/******************************************/

// Get string from clipboard
ZutiloChrome.getFromClipboard = function(silent) {

    var trans = Components.classes['@mozilla.org/widget/transferable;1'].
          createInstance(Components.interfaces.nsITransferable);
    if ('init' in trans) {
        trans.init(window.QueryInterface(Ci.nsIInterfaceRequestor).
            getInterface(Ci.nsIWebNavigation));
    }
    trans.addDataFlavor('text/unicode');

    Services.clipboard.getData(trans, Services.clipboard.kGlobalClipboard);

    var str = {}
    var strLength = {}

    try {
        trans.getTransferData('text/unicode', str, strLength);
    } catch (err) {
        if (!silent) {
            var prompts = Cc['@mozilla.org/embedcomp/prompt-service;1'].
                getService(Components.interfaces.nsIPromptService);
            prompts.alert(null, Zutilo._bundle.
                GetStringFromName('zutilo.error.pastetitle'),
                Zutilo._bundle.
                GetStringFromName('zutilo.error.pastemessage'));
        }
        return '';
    }

    var pasteText
    if (str) {
        pasteText = str.value.
            QueryInterface(Components.interfaces.nsISupportsString).data;
    } else {
        pasteText = '';
    }

    return pasteText;
};

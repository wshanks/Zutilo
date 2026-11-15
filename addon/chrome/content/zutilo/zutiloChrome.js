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
var { Zutilo } = ChromeUtils.importESModule(window.ZutiloModuleURL || "chrome://zutilo/content/zutilo.mjs");

/******************************************/
// Initialization
/******************************************/
// Array holding all root XUL elements (those whose parents are not Zutilo
// elements).
ZutiloChrome.XULRootElements = [];

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

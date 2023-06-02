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

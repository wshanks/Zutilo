/* Copyright 2012 Will Shanks.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
'use strict'
/* global gBrowser, window, document, AddonManager, Components, Services */

var EXPORTED_SYMBOLS = ['Zutilo'];

var Cc = Components.classes
var Ci = Components.interfaces
var Cu = Components.utils
Cu.import('resource://gre/modules/AddonManager.jsm');
Cu.import('resource://gre/modules/Services.jsm');

/**
 * Zutilo namespace.
 */
var Zutilo = {
    /********************************************/
    // Basic information
    /********************************************/
    id: 'zutilo@www.wesailatdawn.com',
    zoteroID: 'zotero@chnm.gmu.edu',
    zoteroTabURL: 'chrome://zotero/content/tab.xul',
    // All strings here should be the exact name of Zutilo functions that take
    // no argument and that should be able to be called from the Zotero item
    // menu
    _itemmenuFunctions: ['copyTags', 'removeTags', 'pasteTags', 'relateItems',
        'showAttachments', 'modifyAttachments', 'copyCreators', 'copyItems',
		'copyItems_alt1', 'copyItems_alt2',
        'copyZoteroSelectLink', 'copyZoteroItemURI', 'createBookSection',
        'createBookItem', 'copyChildIDs', 'relocateChildren'],
    ffcacmFunctions: [
        {name: 'attachPage',
            condition: ''},
        {name: 'attachLink',
            condition: 'onLink'}],

    _bundle: Cc['@mozilla.org/intl/stringbundle;1'].
        getService(Components.interfaces.nsIStringBundleService).
        createBundle('chrome://zutilo/locale/zutilo.properties'),

    itemClipboard: [],

    appName: function() {
        var appInfo = Cc['@mozilla.org/xre/app-info;1'].
            getService(Ci.nsIXULAppInfo);
        var appName;
        switch (appInfo.ID) {
            case '{ec8030f7-c20a-464f-9b0e-13a3a9e97384}':
                // Firefox
                appName = 'Firefox';
                break;
            case 'zotero@chnm.gmu.edu':
                // Zotero Standalone
                appName = 'Zotero';
                break;
            default:
                // Unknown app -- assume it is a Firefox variant...
                appName = 'Firefox';
        }

        return appName;
    }(),

    /********************************************/
    // Zutilo setup functions
    /********************************************/
    init: function() {
        this.observers.register();

        Services.scriptloader.loadSubScript('chrome://zutilo/content/keys.js',
                                            this);

        Zutilo.Prefs.init();
        // Zutilo.ZoteroPrefs.init();

        this.prepareWindows();
    },

    cleanup: function() {
        Zutilo.Prefs.unregister();
        Zutilo.observers.unregister();
        Services.wm.removeListener(Zutilo.windowListener);
    },

    prepareWindows: function() {
        // Load scripts for previously opened windows
        var windows = Services.wm.getEnumerator('navigator:browser');
        while (windows.hasMoreElements()) {
            this.loadWindowChrome(windows.getNext());
        }

        // Add listener to load scripts in windows opened in the future
        Services.wm.addListener(this.windowListener);
    },

    windowListener: {
        onOpenWindow: function(xulWindow) {
            var domWindow = xulWindow
                .QueryInterface(Components.interfaces.nsIInterfaceRequestor)
                .getInterface(Components.interfaces.nsIDOMWindowInternal);

            domWindow.addEventListener('load', function listener() {
                domWindow.removeEventListener('load', listener, false);

                if (domWindow.document.documentElement.
                        getAttribute('windowtype') == 'navigator:browser') {
                    Zutilo.loadWindowChrome(domWindow);
                }
            }, false);
        },

        onCloseWindow: function(xulWindow) {},

        onWindowTitleChange: function(xulWindow, newTitle) {}
    },

    loadWindowChrome: function(scope) {
        // Define ZutiloChrome as window property so it can be deleted on
        // shutdown
        scope.ZutiloChrome = {};

        Services.scriptloader.loadSubScript(
                'chrome://zutilo/content/zutiloChrome.js', scope);
        scope.ZutiloChrome.init();

        // Firefox specific setup
        if (Zutilo.appName == 'Firefox') {
            Services.scriptloader.loadSubScript(
                'chrome://zutilo/content/firefoxOverlay.js', scope);
            scope.ZutiloChrome.firefoxOverlay.init();
        }

        var doZoteroOverlay = function() {
            Services.scriptloader.loadSubScript(
                    'chrome://zutilo/content/zoteroOverlay.js', scope);
            scope.ZutiloChrome.zoteroOverlay.init();
        };

        // Zotero specific setup (only run if Zotero is active)
        if (Zutilo.appName == 'Zotero') {
            doZoteroOverlay();
        } else {
            // Only overlay Zotero in Firefox if it is installed and active
            this.checkZoteroActiveAndCallIf(true, this, doZoteroOverlay);
        }
    },

    observers: {
        observe: function(subject, topic, data) {
            var windows = Services.wm.getEnumerator('navigator:browser');
            var tmpWin;

            switch (topic) {
                case 'zutilo-zoteroitemmenu-update':
                    while (windows.hasMoreElements()) {
                        tmpWin = windows.getNext();
                        if ('undefined' != typeof tmpWin.ZutiloChrome &&
                                'undefined' !=
                                typeof tmpWin.ZutiloChrome.zoteroOverlay) {

                            tmpWin.ZutiloChrome.actOnAllDocuments(
                                tmpWin.ZutiloChrome.zoteroOverlay.
                                refreshZoteroItemPopup);
                        }
                    }
                    break;

                case 'zutilo-shortcut-update':
                    while (windows.hasMoreElements()) {
                        tmpWin = windows.getNext();
                        if ('undefined' != typeof tmpWin.ZutiloChrome) {
                            if ('undefined' !=
                                typeof tmpWin.ZutiloChrome.zoteroOverlay) {
                                tmpWin.ZutiloChrome.zoteroOverlay.
                                    updateKey(data);
                            }
                        }
                    }
                    break;

                default:
            }
        },

        register: function() {
            Services.obs.addObserver(this, 'zutilo-zoteroitemmenu-update',
                                     false);
            Services.obs.addObserver(this, 'zutilo-shortcut-update', false);
        },

        unregister: function() {
            Services.obs.removeObserver(this, 'zutilo-zoteroitemmenu-update');
            Services.obs.removeObserver(this, 'zutilo-shortcut-update');
        }
    },

    /********************************************/
    // General use utility functions
    /********************************************/
    checkZoteroActiveAndCallIf: function(stateBool, scope, func) {
        // stateBool: func is called if Zotero's isActive bool matches stateBool
        // scope: scope that func is called in
        // func: function to be called if Zotero is active
        // Additional arguments of doIfZoteroActive are passed to func

        var args = [];
        for (var i = 3, len = arguments.length; i < len; ++i) {
            args.push(arguments[i]);
        }

        AddonManager.getAddonByID(Zutilo.zoteroID, function(aAddon) {
            if (aAddon && (aAddon.isActive == stateBool)) {
                func.apply(scope, args);
            }
        });
    },

    openLink: function(url) {
        // first construct an nsIURI object using the ioservice
        var ioservice = Cc['@mozilla.org/network/io-service;1']
            .getService(Ci.nsIIOService);

        var uriToOpen = ioservice.newURI(url, null, null);

        var extps = Cc['@mozilla.org/uriloader/external-protocol-service;1']
            .getService(Ci.nsIExternalProtocolService);

        // now, open it!
        extps.loadURI(uriToOpen, null);
    },

    escapeForRegExp: function(str) {
        // Escape all symbols with special regular expression meanings
        // Function taken from http://stackoverflow.com/a/6969486
        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
    }
};

Zutilo.Prefs = {

    init: function() {
        this.prefBranch = Services.prefs.getBranch('extensions.zutilo.');

        // Register observer to handle pref changes
        this.register();
        this.setDefaults();
    },

    setDefaults: function() {
        var defaults = Services.prefs.getDefaultBranch('extensions.zutilo.');

        // Preferences for _itemmenuFunctions
        for (var index = 0;index < Zutilo._itemmenuFunctions.length;index++) {
            defaults.setCharPref('itemmenu.' + Zutilo._itemmenuFunctions[index],
                                 'Zutilo');
        }
        // Preferences for _shortcuts
        // switch to loading shortcuts script and looping on shortcuts object
        for (var keyLabel in Zutilo.keys.shortcuts) {
            defaults.setCharPref('shortcut.' + keyLabel,
                JSON.stringify({modifiers: '', key: '', keycode: ''}));
        }
		// Alternative QuickCopy translators
		defaults.setCharPref('quickCopy_alt1', '')
		defaults.setCharPref('quickCopy_alt2', '')
        // Other preferences
        defaults.setCharPref('attachLinkAppearance', 'Zotero');
        defaults.setCharPref('attachmentImportProcessType', 'Zotero');
        defaults.setCharPref('attachPageAppearance', 'Zotero');
        defaults.setCharPref('lastVersion', '');
        defaults.setBoolPref('showStatusPopupItems', true);
        defaults.setBoolPref('warnZoteroNotActive', true);
    },

    get: function(pref, global) {
        var prefVal;
        try {
            var branch;
            if (global) {
                branch = Services.prefs.getBranch('');
            } else {
                branch = this.prefBranch;
            }

            switch (branch.getPrefType(pref)){
                case branch.PREF_BOOL:
                    prefVal = branch.getBoolPref(pref);
                    break;
                case branch.PREF_STRING:
                    prefVal = branch.getCharPref(pref);
                    break;
                case branch.PREF_INT:
                    prefVal = branch.getIntPref(pref);
                    break;
            }
        }
        catch (e) {
            throw ('Invalid Zutilo pref call for ' + pref);
        }

        return prefVal;
    },

    set: function(pref, value) {
        try {
            switch (this.prefBranch.getPrefType(pref)){
                case this.prefBranch.PREF_BOOL:
                    return this.prefBranch.setBoolPref(pref, value);
                case this.prefBranch.PREF_STRING:
                    return this.prefBranch.setCharPref(pref, value);
                case this.prefBranch.PREF_INT:
                    return this.prefBranch.setIntPref(pref, value);
            }
        }
        catch (e) {
            throw(e);
            // throw ('Invalid preference "' + pref + '"');
        }
        return false;
    },

    clear: function(pref) {
        try {
            this.prefBranch.clearUserPref(pref);
        }
        catch (e) {
            throw ('Invalid preference "' + pref + '"');
        }
    },

    //
    // Methods to register a preferences observer
    //
    register: function() {
        this.prefBranch.addObserver('', this, false);
    },

    unregister: function() {
        if (!this.prefBranch) {
            return;
        }
        this.prefBranch.removeObserver('', this);
    },

    observe: function(subject, topic, data) {
        if (topic != 'nsPref:changed') {
            return;
        }

        var prefParts;

        // Check for itemmenu preference change.  Refresh item menu if there is
        // a change
        if (data.indexOf('itemmenu') === 0) {
            prefParts = data.split('.');
            if (Zutilo._itemmenuFunctions.indexOf(prefParts[1]) != -1) {
                Services.obs.notifyObservers(null,
                                             'zutilo-zoteroitemmenu-update',
                                             null);
            }
        }

        if (data.indexOf('shortcut') === 0) {
            prefParts = data.split('.');
            if (prefParts[1] in Zutilo.keys.shortcuts) {
                Services.obs.notifyObservers(null,
                    'zutilo-shortcut-update', prefParts[1]);
            }
        }
    }
};

// This object was used to watch a Zotero pref, but it's not necessary now.
// Leaving Zutilo.ZoteroPrefs code here for possible future use
/*
Zutilo.ZoteroPrefs = {

    init: function() {
        this.prefBranch = Services.prefs.getBranch('extensions.zotero.');

        // Register observer to handle pref changes
        this.register();
    },

    //
    // Methods to register a preferences observer
    //
    register: function() {
        this.prefBranch.QueryInterface(Components.interfaces.nsIPrefBranch);
        this.prefBranch.addObserver('', this, false);
    },

    unregister: function() {
        if (!this.prefBranch){
            return;
        }
        this.prefBranch.removeObserver('', this);
    },

    observe: function(subject, topic, data) {
        if(topic!='nsPref:changed'){
            return;
        }
        // subject is the nsIPrefBranch we're observing (after appropriate QI)
        // data is the name of the pref that's been changed (relative to
        // subject)
        switch (data){
        }
    }
};
*/

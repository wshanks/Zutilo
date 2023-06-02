/* Copyright 2012 Will Shanks.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
'use strict'
/* global Components, Services */

// eslint-disable-next-line no-unused-vars
var EXPORTED_SYMBOLS = ['Zutilo'];

const {classes: Cc, interfaces: Ci, utils: Cu} = Components;
Cu.import('resource://gre/modules/Services.jsm');
var Zotero = null

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
    _menuFunctions: {
        item: [],
        collection: ['copyZoteroCollectionSelectLink', 'copyZoteroCollectionURI']
    },
    _itemMenuItems_static: ['copyTags', 'removeTags', 'pasteTags', 'relateItems',
        'showAttachments', 'modifyAttachments', 'modifyURLAttachments',
        'copyAttachmentPaths', 'copyCreators', 'copyItems',
        'copyZoteroSelectLink', 'copyZoteroItemURI', 'createBookSection',
        'createBookItem', 'copyChildIDs', 'relocateChildren', 'copyJSON',
        'pasteJSONIntoEmptyFields', 'pasteJSONFromNonEmptyFields',
        'pasteJSONAll', 'pasteJSONItemType', 'openZoteroItemURI'
    ],

    _bundle: Cc['@mozilla.org/intl/stringbundle;1'].
        getService(Components.interfaces.nsIStringBundleService).
        createBundle('chrome://zutilo/locale/zutilo.properties'),

    itemClipboard: [],
    rootURI: null,

    /********************************************/
    // Zutilo setup functions
    /********************************************/
    init: function(rootURI, ZoteroHandle) {
        // There must be a better way to access Zotero than this
        Zotero = ZoteroHandle
        this.rootURI = rootURI

        // Must be run before Prefs.init()
        Services.scriptloader.loadSubScript(
            'chrome://zutilo/content/keys.js',
            this
        )

        this.observers.register()
        Zutilo.Prefs.init()
        // Zutilo.ZoteroPrefs.init()


        this.prepareWindows()
    },

    cleanup: function() {
        Zutilo.Prefs.unregister();
        Zutilo.observers.unregister();
        Services.wm.removeListener(Zutilo.windowListener);
    },

    refreshItemMenuItems: function() {
        this._menuFunctions.item = []
        for (let item of this._itemMenuItems_static) {
            this._menuFunctions.item.push(item)
        }
        let numAlts = Zutilo.Prefs.get('copyItems_alt_total')
        for (let altNum = 1; altNum < numAlts + 1; altNum++) {
            this._menuFunctions.item.push('copyItems_alt' + altNum)
        }
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
                .getInterface(Components.interfaces.nsIDOMWindow)

            domWindow.addEventListener('load', function listener() {
                domWindow.removeEventListener('load', listener, false)

                if (domWindow.document.documentElement.
                        getAttribute('windowtype') == 'navigator:browser') {
                    Zutilo.loadWindowChrome(domWindow)
                }
            }, false)
        },

        onCloseWindow: function(_xulWindow) {},

        onWindowTitleChange: function(_xulWindow, _newTitle) {}
    },

    loadWindowChrome: function(scope) {
        // Define ZutiloChrome as window property so it can be deleted on
        // shutdown
        scope.ZutiloChrome = {};

        Services.scriptloader.loadSubScript(
                'chrome://zutilo/content/zutiloChrome.js', scope);
        scope.ZutiloChrome.init();

        Services.scriptloader.loadSubScript(
                'chrome://zutilo/content/zoteroOverlay.js', scope);
        scope.ZutiloChrome.zoteroOverlay.init();
    },

    observers: {
        observe: function(subject, topic, data) {
            var windows = Services.wm.getEnumerator('navigator:browser');
            var tmpWin;

            switch (topic) {
                case 'zutilo-zoteroitemmenu-update':
                case 'zutilo-zoterocollectionmenu-update': {
                    const menuName = (topic.includes('item') ? 'item' : 'collection')
                    while (windows.hasMoreElements()) {
                        tmpWin = windows.getNext();
                        if ('undefined' != typeof tmpWin.ZutiloChrome &&
                                'undefined' !=
                                typeof tmpWin.ZutiloChrome.zoteroOverlay) {

                            tmpWin.ZutiloChrome.zoteroOverlay.refreshZoteroPopup(menuName)
                        }
                    }
                    break;
                }
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
            Services.obs.addObserver(this, 'zutilo-zoterocollectionmenu-update',
                                     false);
            Services.obs.addObserver(this, 'zutilo-shortcut-update', false);
        },

        unregister: function() {
            Services.obs.removeObserver(this, 'zutilo-zoteroitemmenu-update');
            Services.obs.removeObserver(this, 'zutilo-zoterocollectionmenu-update');
            Services.obs.removeObserver(this, 'zutilo-shortcut-update');
        }
    },

    /********************************************/
    // General use utility functions
    /********************************************/
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
        return str.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&');
    },

    getString: function(name) {
        let match = name.match(/(.*_alt)(\d+)$/)
        if (match === null) {
            return Zutilo._bundle.GetStringFromName(name)
        } else {
            let base = match[1]
            let num = match[2]
            return Zutilo._bundle.formatStringFromName(base, [num], 1)
        }
    }
}

Zutilo.Prefs = {

    init: function() {
        this.prefBranch = Services.prefs.getBranch('extensions.zutilo.');

        // Register observer to handle pref changes
        this.setDefaults()
        this.register()

        
    },

    setDefaults: function() {
        var defaults = Services.prefs.getDefaultBranch('extensions.zutilo.');
        defaults.setIntPref('copyItems_alt_total', 2)

        Zutilo.refreshItemMenuItems()
        Zutilo.keys.refreshAlts()
        // Preferences for _menuFunctions
        for (const menuName of ['item', 'collection']) {
            for (let func of Zutilo._menuFunctions[menuName]) {
                let pref = 'Hide'
                if (['copyTags', 'pasteTags', 'relateItems',
                    'copyItems'].includes(func)) {
                    pref = 'Zutilo'
                }
                defaults.setCharPref(`${menuName}menu.${func}`, pref)
            }
        }
        // Preferences for _shortcuts
        // switch to loading shortcuts script and looping on shortcuts object
        for (var keyLabel in Zutilo.keys.shortcuts) {
            defaults.setCharPref('shortcut.' + keyLabel,
                JSON.stringify({modifiers: '', key: '', keycode: ''}));
        }
        // Alternative QuickCopy translators
        let numAlts = Zutilo.Prefs.get('copyItems_alt_total')
        for (let altNum = 1; altNum < numAlts + 1; altNum++) {
            defaults.setCharPref('quickCopy_alt' + altNum, '')
        }
        // locateItem engine label
        defaults.setCharPref('locateItemEngine', 'Google Scholar Search')
        // Other preferences
        defaults.setCharPref('attachLinkAppearance', 'Zotero');
        defaults.setCharPref('attachmentImportProcessType', 'Zotero');
        defaults.setCharPref('attachPageAppearance', 'Zotero');
        defaults.setCharPref('lastVersion', '');
        defaults.setBoolPref('showStatusPopupItems', true);
        defaults.setBoolPref('warnZoteroNotActive', true);

        Zotero.PreferencePanes.register({
            pluginID: Zutilo.id,
            src: Zutilo.rootURI + 'chrome/content/zutilo/prefs.xhtml',
            scripts: [
              Zutilo.rootURI + 'chrome/content/zutilo/preferences.js',
              Zutilo.rootURI + 'chrome/content/zutilo/keyconfig_adapted.js'
            ]
        })
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
            throw new Error('Invalid Zutilo pref call for ' + pref);
        }

        return prefVal;
    },

    set: function(pref, value) {
        switch (this.prefBranch.getPrefType(pref)){
            case this.prefBranch.PREF_BOOL:
                return this.prefBranch.setBoolPref(pref, value);
            case this.prefBranch.PREF_STRING:
                return this.prefBranch.setCharPref(pref, value);
            case this.prefBranch.PREF_INT:
                return this.prefBranch.setIntPref(pref, value);
        }

        return false;
    },

    clear: function(pref) {
        try {
            this.prefBranch.clearUserPref(pref);
        }
        catch (e) {
            throw new Error('Invalid preference "' + pref + '"');
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

        if  (data === 'copyItems_alt_total') {
            Zutilo.refreshItemMenuItems()
            // In case we need to add new defaults
            Zutilo.Prefs.unregister()
            Zutilo.Prefs.setDefaults()
            Zutilo.Prefs.register()

            let windows = Services.wm.getEnumerator('navigator:browser')
            while (windows.hasMoreElements()) {
                let tmpWin = windows.getNext()

                if (typeof tmpWin.ZutiloChrome == 'undefined') {
                    continue
                }
                if (typeof tmpWin.ZutiloChrome.zoteroOverlay != 'undefined') {
                    tmpWin.ZutiloChrome.zoteroOverlay.reloadKeys()
                    tmpWin.ZutiloChrome.zoteroOverlay.zoteroPopup('item', tmpWin.document)
                }
            }

        } else if (data.indexOf('itemmenu') === 0) {
            prefParts = data.split('.');
            if (Zutilo._menuFunctions.item.includes(prefParts[1])) {
                Services.obs.notifyObservers(null,
                                             'zutilo-zoteroitemmenu-update',
                                             null);
            }
        } else if (data.indexOf('collectionmenu') === 0) {
            prefParts = data.split('.');
            if (Zutilo._menuFunctions.collection.includes(prefParts[1])) {
                Services.obs.notifyObservers(null,
                                             'zutilo-zoterocollectionmenu-update',
                                             null);
            }
        } else if (data.indexOf('shortcut') === 0) {
            prefParts = data.split('.');
            if (prefParts[1] in Zutilo.keys.shortcuts) {
                Services.obs.notifyObservers(null,
                    'zutilo-shortcut-update', prefParts[1]);
            }
        }
    }
}


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

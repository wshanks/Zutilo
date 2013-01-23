/* Copyright 2012 Will Shanks.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var EXPORTED_SYMBOLS = [ "Zutilo" ];

const Cc = Components.classes;
const Ci = Components.interfaces;

Components.utils.import("resource://gre/modules/AddonManager.jsm");
Components.utils.import("resource://gre/modules/Services.jsm");

var appInfo = Components.classes["@mozilla.org/xre/app-info;1"]
                        .getService(Components.interfaces.nsIXULAppInfo);
switch (appInfo.ID) {
	case "{ec8030f7-c20a-464f-9b0e-13a3a9e97384}":
	// Firefox
		var appName = 'Firefox';
		break;
	case "zotero@chnm.gmu.edu":
	// Zotero Standalone
		var appName = 'Zotero';
		break;
	default:
	// Unknown app
		var appName = 'Unknown';
}

var windowListener = {
    onOpenWindow: function(xulWindow) {
        var domWindow = xulWindow
            .QueryInterface(Components.interfaces.nsIInterfaceRequestor)
            .getInterface(Components.interfaces.nsIDOMWindowInternal);

        domWindow.addEventListener('load', function listener() {
            domWindow.removeEventListener('load',listener,false);

            if (domWindow.document.documentElement.getAttribute('windowtype') == 'navigator:browser')
                Zutilo.loadWindowScripts(domWindow);
        },false);
    },

    onCloseWindow: function(xulWindow) {},

    onWindowTitleChange: function(xulWindow, newTitle) {}
};

/**
 * Zutilo namespace.
 */
var Zutilo = {
  	id: 'zutilo@www.wesailatdawn.com',
  	zoteroID: 'zotero@chnm.gmu.edu',
  	//All strings here should be the exact name of Zutilo functions that take no
	//argument and that should be able to be called from the Zotero item menu
  	_itemmenuFunctions: ["copyTags","pasteTags","relateItems","showAttachments",
		"modifyAttachments","copyCreators"],
	
	_bundle: Cc["@mozilla.org/intl/stringbundle;1"].
		getService(Components.interfaces.nsIStringBundleService).
		createBundle("chrome://zutilo/locale/zutilo.properties"),
		
	_appName: appName,
	
	zoteroActive: true,
	upgradeMessage: '',
	
	init: function() {
		Zutilo.Prefs.init();
		//Zutilo.ZoteroPrefs.init();
		this.checkIfUpgraded();
		
		var windows = Services.wm.getEnumerator('navigator:browser');
		while (windows.hasMoreElements()) {
			this.loadWindowScripts(windows.getNext());
		}
			
		Services.wm.addListener(windowListener);
	},
	
	loadWindowScripts: function(scope) {
	// initBool: if true, run scripts' init() functions since the windows are already 
	// 		loaded and the load event listener won't fire.
		Services.scriptloader.loadSubScript(
				'chrome://zutilo/content/zutiloChrome.js', scope);
				
		if (Zutilo._appName == 'Firefox') {
			// Firefox specific setup
			Services.scriptloader.loadSubScript(
				'chrome://zutilo/content/firefoxOverlay.js', scope);
			scope.ZutiloChrome.firefoxOverlay.init();
		}
		
		if (Zutilo.zoteroActive) {
			// Zotero specific setup
			Services.scriptloader.loadSubScript(
				'chrome://zutilo/content/zoteroOverlay.js', scope);
			scope.ZutiloChrome.zoteroOverlay.init();
		}
	},
	
	shutdown: function() {
		Services.obs.notifyObservers(null, "zutilo-shutdown", null);
	
		var windows = Services.wm.getEnumerator('navigator:browser');
		while (windows.hasMoreElements()) {
			var tempWin = windows.getNext();
			delete tempWin.ZutiloChrome;
			delete tempWin.Zutilo;
		}
		
		Cc["@mozilla.org/intl/stringbundle;1"].
			getService(Components.interfaces.nsIStringBundleService).flushBundles();
	},
	
	checkIfUpgraded: function() {
		var lastVersion = Zutilo.Prefs.get('lastVersion');

		AddonManager.getAddonByID(Zutilo.id,
			function(aAddon) {
				if (lastVersion != aAddon.version) {
					Zutilo.Prefs.set('lastVersion',aAddon.version);
					
					//lastVersion == '' for new install.  Don't show upgrade message
					//to new users
					if (lastVersion != '') {
						Zutilo.upgradeMessage = Zutilo._bundle.
							GetStringFromName("zutilo.startup.upgrademessage");
					}
				}
			});
	},
	
	openLink: function(url) {
		// first construct an nsIURI object using the ioservice
		var ioservice = Components.classes["@mozilla.org/network/io-service;1"]
			.getService(Components.interfaces.nsIIOService);
		
		var uriToOpen = ioservice.newURI(url, null, null);
		
		var extps = Components.
			classes["@mozilla.org/uriloader/external-protocol-service;1"]
			.getService(Components.interfaces.nsIExternalProtocolService);
		
		// now, open it!
		extps.loadURI(uriToOpen, null);
	},
	
	escapeForRegExp: function(str) {
		// Escape all symbols with special regular expression meanings
		// Function taken from http://stackoverflow.com/a/6969486
		return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&")
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

		//Preferences for _itemmenuFunctions
		for (var index=0;index<Zutilo._itemmenuFunctions.length;index++) {
			defaults.setCharPref('itemmenu.'+Zutilo._itemmenuFunctions[index],'Zutilo');
		}
		//Other preferences
		defaults.setBoolPref("warnZoteroNotActive",true);
		defaults.setCharPref("lastVersion",'');
		
		//Not active yet
		//defaults.setCharPref("customAttachmentPath", '');
	},
	
	get: function(pref, global) {
		var prefVal;
		try {
			if (global) {
				var branch = Services.prefs.getBranch("");
			}
			else {
				var branch = this.prefBranch;
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
		catch (e){
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
		catch (e){
			throw(e);
			throw ("Invalid preference '" + pref + "'");
		}
		return false;
	},
	
	clear: function(pref) {
		try {
			this.prefBranch.clearUserPref(pref);
		}
		catch (e) {
			throw ("Invalid preference '" + pref + "'");
		}
	},
	
	//
	// Methods to register a preferences observer
	//
	register: function() {
		this.prefBranch.addObserver("", this, false);
	},
	
	unregister: function() {
		if (!this.prefBranch){
			return;
		}
		this.prefBranch.removeObserver("", this);
	},
	
	observe: function(subject, topic, data) {
		if(topic!="nsPref:changed"){
			return;
		}
		// subject is the nsIPrefBranch we're observing (after appropriate QI)
		// data is the name of the pref that's been changed (relative to subject)
		switch (data){
			case "customAttachmentPath":
				break;
		}
		
		//Check for itemmenu preference change.  Refresh item menu if there is a change
		if (data.indexOf('itemmenu') == 0 ) {
			var prefParts = data.split('.');
			if (Zutilo._itemmenuFunctions.indexOf(prefParts[1]) != -1) {
				Services.obs.notifyObservers(null, "zutilo-zoteroitemmenu-update", null);
			}
		}
	}
};

//This object was used to watch a Zotero pref, but it's not necessary now.  
//Leaving Zutilo.ZoteroPrefs code here for possible future use
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
		this.prefBranch.addObserver("", this, false);
	},
	
	unregister: function() {
		if (!this.prefBranch){
			return;
		}
		this.prefBranch.removeObserver("", this);
	},
	
	observe: function(subject, topic, data) {
		if(topic!="nsPref:changed"){
			return;
		}
		// subject is the nsIPrefBranch we're observing (after appropriate QI)
		// data is the name of the pref that's been changed (relative to subject)
		switch (data){
		}
	}
};
*/
/* Copyright 2012 Will Shanks.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var EXPORTED_SYMBOLS = [];

const Cc = Components.classes;
const Ci = Components.interfaces;

Components.utils.import("chrome://zutilo/content/zutilo.jsm");

Zutilo.Prefs = {

	init: function() {
		var prefs = Components.classes["@mozilla.org/preferences-service;1"]
						.getService(Components.interfaces.nsIPrefService);
		this.prefBranch = prefs.getBranch('extensions.zutilo.');
		
		// Register observer to handle pref changes
		this.register();
		
		//Get all prefs from _itemmenuFunctions to make sure that they are defined.
		for (var index=0;index<Zutilo._itemmenuFunctions.length;index++) {
			Zutilo.Prefs.get('itemmenu.'+Zutilo._itemmenuFunctions[index],false);
		}
	},
	
	get: function(pref, global) {
		var prefVal;
		try {
			if (global) {
				var service = Components.classes["@mozilla.org/preferences-service;1"]
					.getService(Components.interfaces.nsIPrefService);
			}
			else {
				var service = this.prefBranch;
			}
			
			switch (this.prefBranch.getPrefType(pref)){
				case this.prefBranch.PREF_BOOL:
					prefVal = this.prefBranch.getBoolPref(pref);
				case this.prefBranch.PREF_STRING:
					prefVal = this.prefBranch.getCharPref(pref);
				case this.prefBranch.PREF_INT:
					prefVal = this.prefBranch.getIntPref(pref);
			}
		}
		catch (e){
			//Do nothing because getting preferences always generates an error for some 
			//reason
		}
		
		if (!prefVal) {
			var splitPref = pref.split('.');
			if ((splitPref[0] == 'itemmenu') && 
				(Zutilo._itemmenuFunctions.indexOf(splitPref[1]) != -1)) {
				Zutilo.Prefs.set(pref,Zutilo._defaults.itemmenuAppearance);
			}
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
				
				// If not an existing pref, create appropriate type automatically
				case 0:
					if (typeof value == 'boolean') {
						return this.prefBranch.setBoolPref(pref, value);
					}
					if (typeof value == 'string') {
						return this.prefBranch.setCharPref(pref, value);
					}
					if (parseInt(value) == value) {
						return this.prefBranch.setIntPref(pref, value);
					}
					throw ("Invalid preference value '" + value + "' for pref '" + pref + "'");
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
			case "customAttachmentPath":
				break;
		}
		
		//Check for itemmenu preference change.  Refresh item menu if there is a change
		if (data.indexOf('itemmenu') == 0 ) {
			var prefParts = data.split('.');
			if (Zutilo._itemmenuFunctions.indexOf(prefParts[1]) != -1) {
				Components.classes["@mozilla.org/observer-service;1"]
          			.getService(Components.interfaces.nsIObserverService)
          			.notifyObservers(null, "zutilo-zoteroitemmenu-update", null);
			}
		}
	}
};

Zutilo.ZoteroPrefs = {

	init: function() {
		var prefs = Components.classes["@mozilla.org/preferences-service;1"]
						.getService(Components.interfaces.nsIPrefService);
		this.prefBranch = prefs.getBranch('extensions.zotero.');
		
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
			case "showIn":
				Components.classes["@mozilla.org/observer-service;1"]
          			.getService(Components.interfaces.nsIObserverService)
          			.notifyObservers(null, "zutilo-zoteroitemmenu-update", null);
				break;
		}
	}
};

Zutilo.Prefs.init();
Zutilo.ZoteroPrefs.init();
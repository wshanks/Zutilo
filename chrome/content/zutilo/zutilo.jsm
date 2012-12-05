/* Copyright 2012 Will Shanks.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var EXPORTED_SYMBOLS = [ "Zutilo" ];

const Cc = Components.classes;
const Ci = Components.interfaces;

Components.utils.import("resource://gre/modules/AddonManager.jsm");

/**
 * Zutilo namespace.
 */
if ("undefined" == typeof(Zutilo)) {
  var Zutilo = {
  	id: 'zutilo@www.wesailatdawn.com',
  	zoteroID: 'zotero@chnm.gmu.edu',
  	//All strings here should be the exact name of Zutilo functions that take no
	//argument and that should be able to be called from the Zotero item menu
  	_itemmenuFunctions: ["copyTags","pasteTags","relateItems","showAttachments",
		"modifyAttachments","copyCreators"],
	_defaults: {
		itemmenuAppearance: 'Zutilo'
	},
	
	_bundle: Cc["@mozilla.org/intl/stringbundle;1"].
		getService(Components.interfaces.nsIStringBundleService).
		createBundle("chrome://zutilo/locale/zutilo.properties"),
	
	zoteroActive: true,
	upgradeMessage: '',
	
	init: function() {
		this.checkIfUpgraded();
	},
	
	checkIfUpgraded: function() {
		var prefs = Components.classes["@mozilla.org/preferences-service;1"]
						.getService(Components.interfaces.nsIPrefService);
		var prefBranch = prefs.getBranch('extensions.zutilo.');
		var lastVersion = prefBranch.getCharPref('lastVersion');

		AddonManager.getAddonByID(Zutilo.id,
			function(aAddon) {
				if (lastVersion != aAddon.version) {
					prefBranch.setCharPref('lastVersion',aAddon.version);
					
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
	}
  };
};

// Include other Zutilo core modules
Components.utils.import("chrome://zutilo/content/preferences.jsm");

Zutilo.init();
/* Copyright 2012 Will Shanks.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var EXPORTED_SYMBOLS = [ "Zutilo" ];

const Cc = Components.classes;
const Ci = Components.interfaces;

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
	
	zoteroActive: true
  };
};

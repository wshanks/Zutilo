/* Copyright 2012 Will Shanks.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

Components.utils.import("resource://zutilomodules/zutilo.jsm");
Components.utils.import("resource://zutilomodules/preferences.jsm");

function buildItemmenuPrefs() {
	for (var index=0;index<Zutilo._itemmenuFunctions.length;index++) {
		addItemmenuPreference(Zutilo._itemmenuFunctions[index]);
		addItemmenuRadiogroup(Zutilo._itemmenuFunctions[index]);
	}
}

function addItemmenuPreference(itemmenuFunction) {
	var newPref=document.createElement("preference");
	newPref.setAttribute("id","pref-itemmenu-"+itemmenuFunction);
	newPref.setAttribute("name","extensions.zutilo.itemmenu."+itemmenuFunction);
	newPref.setAttribute("type","string");
	
	var zutiloPrefs=document.getElementById("zutilo-prefpane-ui-preferences");
	zutiloPrefs.appendChild(newPref);
}

function addItemmenuRadiogroup(itemmenuFunction) {
	var newRow = document.createElement("row");
	
	var newHbox = document.createElement("hbox");
	newHbox.setAttribute("align","center");
	var newLabel = document.createElement("label");
	newLabel.setAttribute("value",Zutilo._bundle.GetStringFromName(
		"zutilo.preferences.itemmenu."+ itemmenuFunction));
	newHbox.appendChild(newLabel);
	newRow.appendChild(newHbox);
	
	var newRadiogroup = document.createElement("radiogroup");
	newRadiogroup.setAttribute("orient","horizontal");
	newRadiogroup.setAttribute("align","center");
	newRadiogroup.setAttribute("preference","pref-itemmenu-"+itemmenuFunction);
	
	var labelList = ['Zotero','Zutilo',Zutilo._bundle.GetStringFromName(
		"zutilo.preferences.itemmenu.Hide")];
	var newRadio;
	for (var index=0;index<labelList.length;index++) {
		newRadio = document.createElement("radio");
		newRadio.setAttribute("label",Zutilo._bundle.GetStringFromName(
			"zutilo.preferences.itemmenu."+ labelList[index]));
		newRadio.setAttribute("value",labelList[index]);
		newRadiogroup.appendChild(newRadio);
	}
	
	newRow.appendChild(newRadiogroup);
	
	var itemmenuRows = document.getElementById("zutilo-prefpane-ui-rows");
	itemmenuRows.appendChild(newRow);
}

function showReadme() {
	window.openDialog('chrome://zutilo/content/readme.xul', 'zutilo-readme-window', 'chrome');
}

function openLink(url) {
	// first construct an nsIURI object using the ioservice
	var ioservice = Components.classes["@mozilla.org/network/io-service;1"]
		.getService(Components.interfaces.nsIIOService);
	
	var uriToOpen = ioservice.newURI(url, null, null);
	
	var extps = Components.classes["@mozilla.org/uriloader/external-protocol-service;1"]
		.getService(Components.interfaces.nsIExternalProtocolService);
	
	// now, open it!
	extps.loadURI(uriToOpen, null);
}
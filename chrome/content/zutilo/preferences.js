/* Copyright 2012 Will Shanks.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

function chooseAttachmentDirectory() {
	var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"]
			.getService(Components.interfaces.nsIWindowMediator);
	var win = wm.getMostRecentWindow('navigator:browser');
	
	var ps = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
		.getService(Components.interfaces.nsIPromptService);
	
	
	var nsIFilePicker = Components.interfaces.nsIFilePicker;
	while (true) {
		var fp = Components.classes["@mozilla.org/filepicker;1"]
					.createInstance(nsIFilePicker);
		fp.init(win, Zotero.getString('attachmentBasePath.selectDir'), nsIFilePicker.modeGetFolder);
		fp.appendFilters(nsIFilePicker.filterAll);
		if (fp.show() == nsIFilePicker.returnOK) {
			var file = fp.file;
			
			// Set new data directory
			Zotero.Zutilo.Prefs.set('customAttachmentPath', file.persistentDescriptor);
			Zotero.Prefs.set('lastDataDir', file.path);
			break;
		}
		else {
			return false;
		}
	}
	
	return file.path;
}

function buildItemmenuPrefs() {
	for (var index=0;index<Zotero.Zutilo._itemmenuFunctions.length;index++) {
		addItemmenuPreference(Zotero.Zutilo._itemmenuFunctions[index]);
		addItemmenuRadiogroup(Zotero.Zutilo._itemmenuFunctions[index]);
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
	newLabel.setAttribute("value",Zotero.Zutilo._bundle.GetStringFromName(
		"zutilo.preferences.itemmenu."+ itemmenuFunction));
	newHbox.appendChild(newLabel);
	newRow.appendChild(newHbox);
	
	var newRadiogroup = document.createElement("radiogroup");
	newRadiogroup.setAttribute("orient","horizontal");
	newRadiogroup.setAttribute("align","center");
	newRadiogroup.setAttribute("preference","pref-itemmenu-"+itemmenuFunction);
	
	var labelList = ['Zotero','Zutilo','Hide'];
	var newRadio;
	for (var index=0;index<labelList.length;index++) {
		newRadio = document.createElement("radio");
		newRadio.setAttribute("label",Zotero.Zutilo._bundle.GetStringFromName(
			"zutilo.preferences.itemmenu."+ labelList[index]));
		newRadio.setAttribute("value",labelList[index]);
		newRadiogroup.appendChild(newRadio);
	}
	
	newRow.appendChild(newRadiogroup);
	
	var itemmenuRows = document.getElementById("zutilo-prefpane-ui-rows");
	itemmenuRows.appendChild(newRow);
}
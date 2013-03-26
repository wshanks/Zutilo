/* Copyright 2012 Will Shanks.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";
Components.utils.import("resource://gre/modules/Services.jsm");
///////////////////////////////////////////
// Include core modules
///////////////////////////////////////////
Components.utils.import("chrome://zutilo/content/zutilo.jsm");

///////////////////////////////////////////
// Firefox overlay
///////////////////////////////////////////
ZutiloChrome.firefoxOverlay = new function() {
	this.init = init;
	this.unload = unload;
	this.warnZoteroNotActive = warnZoteroNotActive;
	this.firefoxZoteroOverlay = firefoxZoteroOverlay;
	
	this.warnedThisSession = false;
	
	function init() {
		window.setTimeout(function() {
			if (typeof ZutiloChrome != 'undefined') {
				Zutilo.checkZoteroActiveAndCallIf(false,ZutiloChrome.firefoxOverlay,
					ZutiloChrome.firefoxOverlay.warnZoteroNotActive);
				Zutilo.checkZoteroActiveAndCallIf(true,ZutiloChrome.firefoxOverlay,
					ZutiloChrome.firefoxOverlay.firefoxZoteroOverlay);
			}
		}, 500);
	}
	
	function unload() {
		cleanupStatusPopup();
	}
	
	function warnZoteroNotActive() {
		var showWarn = Zutilo.Prefs.get('warnZoteroNotActive');
		
		if (showWarn && !this.warnedThisSession) {
			window.openDialog('chrome://zutilo/content/zoteroNotActive.xul', 
				'zutilo-zoteroNotActive-window', 'chrome,centerscreen');
			this.warnedThisSession = true;
		}
	}
	
	//////////////////////////////////////////////////////////////////////////////////
	// Load Firefox-specific overlay that is relevant only when Zotero is active
	//////////////////////////////////////////////////////////////////////////////////
	function firefoxZoteroOverlay() {
		this.scrapeThisPage = scrapeThisPage;
		this.performTranslation = performTranslation;
		
		setupStatusPopup();
	}
	
	function setupStatusPopup() {
		var statusPopupEl = document.getElementById("zotero-status-image-context");
		statusPopupEl.addEventListener('popupshowing',statusPopupListener,false);
	}
	
	function cleanupStatusPopup() {
		var statusPopupEl = document.getElementById("zotero-status-image-context");
		statusPopupEl.removeEventListener('popupshowing',statusPopupListener,false);
		Zutilo.removeXUL(statusPopupEl);
	}
	
	function statusPopupListener(e) {
		if (!Zutilo.Prefs.get('showStatusPopupItems')) {
			return
		}
		
		var popup = e.target;
		
		var menuSep = document.createElement("menuseparator");
		menuSep.setAttribute('id', 'zutilo-zoterostatuspopup-menusep');
		popup.appendChild(menuSep);
		
		var prefFilesBool = Zotero.Prefs.get('downloadAssociatedFiles');
		if (prefFilesBool) {
			var labelEnd = ' ' + Zutilo._bundle.
				GetStringFromName("zutilo.pagescrape.statusPopup.noAttachments");
		} else {
			var labelEnd = ' ' + Zutilo._bundle.
				GetStringFromName("zutilo.pagescrape.statusPopup.withAttachments");
		}
		
		var tab = _getTabObject(Zotero_Browser.tabbrowser.selectedBrowser);
		var translators = tab.page.translators;
		for(var index=0, n=translators.length; index<n; index++) {
			let translator = translators[index];
			
			var menuitem = document.createElement("menuitem");
			var label = Zotero.getString("ingester.saveToZoteroUsing", 
				translator.label) + labelEnd;
			menuitem.setAttribute("label", label);
			menuitem.setAttribute("image", (translator.itemType === "multiple"
				? "chrome://zotero/skin/treesource-collection.png"
				: Zotero.ItemTypes.getImageSrc(translator.itemType)));
			menuitem.setAttribute("class", "menuitem-iconic");
			menuitem.addEventListener("command", function(e) {
				ZutiloChrome.firefoxOverlay.scrapeThisPage(translator, !prefFilesBool);
			}, false);
			menuitem.setAttribute("id", 'zutilo-zoterostatuspopup-item'+index);
			if (Zutilo.freezeDownloadPref) {
				menuitem.setAttribute('disabled', 'true');
			}
			popup.appendChild(menuitem);
		}
	}
	
	/*
	This function is a copy of Zotero_Browser.scrapeThisPage() in Zotero's 
	browser.js file with extra blocks of code inserted to toggle Zotero's 
	downloadAssociatedFiles preference if it does not match filesBool.  The added blocks
	of code are marked with preceding and following comments.
	*/
	function scrapeThisPage(translator, filesBool) {
		// BEGIN ADDITION
		if (Zutilo.freezeDownloadPref) {
		/*
		 Don't allow multiple simultaneous instances of scrapeThisPage() that involve a 
		 changed value for the downloadAssociatedFiels preference.  Because 
		 translation is performed asynchronously, multiple instances of scrapeThisPage()
		 each setting the downloadAssociatedFiles preference could produce erratic
		 results
		*/
			Services.prompt.alert(null,
				Zutilo._bundle.
					GetStringFromName("zutilo.pagescrape.multipleExecution.title"),
				Zutilo._bundle.
					GetStringFromName("zutilo.pagescrape.multipleExecution.body"));
			return
		}
		// END ADDITION
		// Perform translation
		var tab = _getTabObject(Zotero_Browser.tabbrowser.selectedBrowser);
		if(tab.page.translators && tab.page.translators.length) {
			tab.page.translate.setTranslator(translator || tab.page.translators[0]);
			// BEGIN ADDITION
			var prefFilesBool = Zotero.Prefs.get('downloadAssociatedFiles');
			if (prefFilesBool != filesBool) {
				Zotero.Prefs.set('downloadAssociatedFiles',filesBool);
				Zutilo.freezeDownloadPref = true;
				var doneHandler = function(obj, status) {
					Zotero.Prefs.set('downloadAssociatedFiles',prefFilesBool);
					Zutilo.freezeDownloadPref = false;
				};
			}
			// END ADDITION
			// MODIFICATION: the following line uses modified version of 
			// performTranslation compared to the one called in browser.js
			ZutiloChrome.firefoxOverlay.performTranslation(tab.page.translate, 
				undefined, undefined, doneHandler);
		}
	}
	
	/*
	This function is a copy of _getTabObject() in Zotero's browser.js file. It is defined
	as a private function there and so can not be directly here.
	*/
	function _getTabObject(browser) {
		if(!browser) return false;
		if(!browser.zoteroBrowserData) {
			browser.zoteroBrowserData = new Zotero_Browser.Tab(browser);
		}
		return browser.zoteroBrowserData;
	}
	
	/*
	This function is a copy of Zotero_Browser.performTranslation() in Zotero's 
	browser.js file with extra blocks of code inserted to allow for a second "done" 
	handler to be set (performTranslation clears the done handlers internally, so the
	handler can not be passed in to Zotero's performTranslation()).
	*/
	function performTranslation(translate, libraryID, collection, doneHandler) {
		if (Zotero.locked) {
			Zotero_Browser.progress.changeHeadline(Zotero.getString("ingester.scrapeError"));
			var desc = Zotero.localeJoin([
				Zotero.getString('general.operationInProgress'),
				Zotero.getString('general.operationInProgress.waitUntilFinishedAndTryAgain')
			]);
			Zotero_Browser.progress.addDescription(desc);
			Zotero_Browser.progress.show();
			Zotero_Browser.progress.startCloseTimer(8000);
			return;
		}
		
		if (!Zotero.stateCheck()) {
			Zotero_Browser.progress.changeHeadline(Zotero.getString("ingester.scrapeError"));
			var desc = Zotero.getString("ingester.scrapeErrorDescription.previousError")
				+ ' ' + Zotero.getString("general.restartFirefoxAndTryAgain", Zotero.appName);
			Zotero_Browser.progress.addDescription(desc);
			Zotero_Browser.progress.show();
			Zotero_Browser.progress.startCloseTimer(8000);
			return;
		}
		
		Zotero_Browser.progress.show();
		Zotero_Browser.isScraping = true;
		
		// Get libraryID and collectionID
		if(libraryID === undefined && ZoteroPane && !Zotero.isConnector) {
			try {
				if (!ZoteroPane.collectionsView.editable) {
					Zotero_Browser.progress.changeHeadline(Zotero.getString("ingester.scrapeError"));
					var desc = Zotero.getString('save.error.cannotMakeChangesToCollection');
					Zotero_Browser.progress.addDescription(desc);
					Zotero_Browser.progress.show();
					Zotero_Browser.progress.startCloseTimer(8000);
					return;
				}
				
				libraryID = ZoteroPane.getSelectedLibraryID();
				collection = ZoteroPane.getSelectedCollection();
			} catch(e) {}
		}
		
		if(Zotero.isConnector) {
			Zotero.Connector.callMethod("getSelectedCollection", {}, function(response, status) {
				if(status !== 200) {
					Zotero_Browser.progress.changeHeadline(Zotero.getString("ingester.scraping"));
				} else {
					Zotero_Browser.progress.changeHeadline(Zotero.getString("ingester.scrapingTo"),
						"chrome://zotero/skin/treesource-"+(response.id ? "collection" : "library")+".png",
						response.name+"\u2026");
				}
			});
		} else {
			var name;
			if(collection) {
				name = collection.name;
			} else if(libraryID) {
				name = Zotero.Libraries.getName(libraryID);
			} else {
				name = Zotero.getString("pane.collections.library");
			}
			
			Zotero_Browser.progress.changeHeadline(Zotero.getString("ingester.scrapingTo"),
				"chrome://zotero/skin/treesource-"+(collection ? "collection" : "library")+".png",
				name+"\u2026");
		}
		
		translate.clearHandlers("done");
		translate.clearHandlers("itemDone");
		
		translate.setHandler("done", function(obj, returnValue) {		
			if(!returnValue) {
				Zotero_Browser.progress.show();
				Zotero_Browser.progress.changeHeadline(Zotero.getString("ingester.scrapeError"));
				// Include link to Known Translator Issues page
				var url = "http://www.zotero.org/documentation/known_translator_issues";
				var linkText = '<a href="' + url + '" tooltiptext="' + url + '">'
					+ Zotero.getString('ingester.scrapeErrorDescription.linkText') + '</a>';
				Zotero_Browser.progress.addDescription(Zotero.getString("ingester.scrapeErrorDescription", linkText));
				Zotero_Browser.progress.startCloseTimer(8000);
			} else {
				Zotero_Browser.progress.startCloseTimer();
			}
			Zotero_Browser.isScraping = false;
		});
		
		// BEGIN ADDITION
		translate.setHandler('done', doneHandler);
		// END ADDITION
		
		var attachmentsMap = new WeakMap();
		
		translate.setHandler("itemDone", function(obj, dbItem, item) {
			Zotero_Browser.progress.show();
			var itemProgress = new Zotero_Browser.progress.ItemProgress(Zotero.ItemTypes.getImageSrc(item.itemType),
				item.title);
			itemProgress.setProgress(100);
			for(var i=0; i<item.attachments.length; i++) {
				var attachment = item.attachments[i];
				attachmentsMap.set(attachment,
					new Zotero_Browser.progress.ItemProgress(
						Zotero.Utilities.determineAttachmentIcon(attachment),
						attachment.title, itemProgress));
			}
			
			// add item to collection, if one was specified
			if(collection) {
				collection.addItem(dbItem.id);
			}
		});
		
		translate.setHandler("attachmentProgress", function(obj, attachment, progress, error) {
			var itemProgress = attachmentsMap.get(attachment);
			if(progress === false) {
				itemProgress.setError();
			} else {
				itemProgress.setProgress(progress);
				if(progress === 100) {
					itemProgress.setIcon(Zotero.Utilities.determineAttachmentIcon(attachment));
				}
			}
		});
		
		translate.translate(libraryID);
	}
};
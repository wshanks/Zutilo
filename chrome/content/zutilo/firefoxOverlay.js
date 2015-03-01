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
	
	this.warnedThisSession = false;
	this.cleanupQueue = [];
	
	function init() {
		window.setTimeout(function() {
			if (typeof ZutiloChrome != 'undefined') {
				Zutilo.checkZoteroActiveAndCallIf(false,ZutiloChrome.firefoxOverlay,
					ZutiloChrome.firefoxOverlay.warnZoteroNotActive);
				Zutilo.checkZoteroActiveAndCallIf(true,ZutiloChrome.firefoxOverlay,
					firefoxZoteroOverlay);
			}
		}, 500);
	}
	
	function unload() {
		cleanupStatusPopup();
		for (var index=0; index<this.cleanupQueue.length; index++) {
			this.cleanupQueue[index]();
		}
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
		this.attachURLToCurrentItem = attachURLToCurrentItem;
		this.attachURLToItem = attachURLToItem;
		this.refreshContentAreaContextMenu = refreshContentAreaContextMenu;
		
		this.scrapeQueue = {
			count: 0,
			currentFilesBool: undefined,
			originalFilesBool: undefined
		};
		
		setupStatusPopup();
		setupContentAreaContextMenu();
	}
	
	//////////////////////////////////////////////////////////////////////////////////
	// Firefox contentAreaContextMenu
	//////////////////////////////////////////////////////////////////////////////////
	
	function setupContentAreaContextMenu() {
		var FFContAreaContMenu = document.getElementById('contentAreaContextMenu');
		var ZoteroSubmenu = document.getElementById("zotero-content-area-context-menu");
		
		appendCACMCommandItems(FFContAreaContMenu, 'zutilo-ffcacm-', 
			ZoteroSubmenu.nextSibling);
		
		var ZoteroSubmenuPopup = 
			document.getElementById('zotero-context-item-from-page').parentElement;
		var ZoteroSubmenuSeparator = document.createElement('menuseparator');
		var ZoteroSubmenuSeparatorID = 'zutilo-ffcacm-zoterosubmenu-separator';
		ZoteroSubmenuSeparator.setAttribute('id','zutilo-ffcacm-zoterosubmenu-separator');
		ZoteroSubmenuPopup.appendChild(ZoteroSubmenuSeparator);
		ZutiloChrome.XULRootElements.push(ZoteroSubmenuSeparatorID);
		appendCACMCommandItems(ZoteroSubmenuPopup, 'zutilo-ffcacm-zoterosubmenu-');
		
		FFContAreaContMenu.addEventListener("popupshowing", 
			ZutiloChrome.firefoxOverlay.refreshContentAreaContextMenu, false);
		ZutiloChrome.firefoxOverlay.cleanupQueue.push(cleanupFFCACM);
	}
	
	// CACM = contentAreaContextMenu
	function appendCACMCommandItems(parentElement, IDPrefix, nextElement) {
		
		var attachPageCmd = function(event) {
				var processType = undefined;
				if (event.shiftKey) {
					processType = 'prompt';
				} else if (event.ctrlKey) {
					processType = 'Zotero';
				}
				ZutiloChrome.firefoxOverlay.attachURLToCurrentItem(
					window.content.location.href, processType);
			};
			
		var attachLinkCmd = function(event) {
				var processType = undefined;
				if (event.shiftKey) {
					processType = 'prompt';
				} else if (event.ctrlKey) {
					processType = 'Zotero';
				}
				ZutiloChrome.firefoxOverlay.attachURLToCurrentItem(
					window.gContextMenu.linkURL, processType);
			};
			
		var commands = [attachPageCmd, attachLinkCmd];
		
		for (var index=0; index<Zutilo.ffcacmFunctions.length; index++) {
			appendCACMSingleItem(parentElement, IDPrefix, 
				Zutilo.ffcacmFunctions[index].name, commands[index], nextElement);
		}
	}
	
	function appendCACMSingleItem(parentElement, IDPrefix, IDSuffix, command, 
		nextElement) {
		var menuEl = document.createElement("menuitem");
		var elementID = IDPrefix + IDSuffix;
		menuEl.setAttribute("id", elementID);
		menuEl.setAttribute("label",
			Zutilo._bundle.GetStringFromName("zutilo.ffcacm." + IDSuffix));
		menuEl.addEventListener('command', command, false);
		parentElement.insertBefore(menuEl, nextElement);
		ZutiloChrome.XULRootElements.push(elementID);
	}
	
	function refreshContentAreaContextMenu() {
		var showMenuSeparator = false;
		
		for (var index=0; index<Zutilo.ffcacmFunctions.length; index++) {
			var prefVal = Zutilo.Prefs.get(
				Zutilo.ffcacmFunctions[index].name+'Appearance');
			
			var ffcacmMenuItem = document.getElementById(
				'zutilo-ffcacm-' + Zutilo.ffcacmFunctions[index].name);
			var zoteroMenuItem = document.getElementById(
				'zutilo-ffcacm-zoterosubmenu-' + Zutilo.ffcacmFunctions[index].name);
			
			var doNotShow = false;
			if (Zutilo.ffcacmFunctions[index].condition == 'onLink') {
				if (!window.gContextMenu.onLink) {
					doNotShow = true;
				}
			}
			
			if (prefVal == 'Firefox') {
				zoteroMenuItem.hidden = true;
				ffcacmMenuItem.hidden = doNotShow;
			} else if (prefVal == 'Zotero') {
				ffcacmMenuItem.hidden = true;
				zoteroMenuItem.hidden = doNotShow;
				if (!doNotShow) {
					showMenuSeparator = true;
				}
			} else {
				zoteroMenuItem.hidden = true;
				ffcacmMenuItem.hidden = true;
			}
		}
		
		var menuSeparator = 
			document.getElementById('zutilo-ffcacm-zoterosubmenu-separator');
		if (showMenuSeparator) {
			menuSeparator.hidden = false;
		} else {
			menuSeparator.hidden = true;
		}
	}
	
	function cleanupFFCACM() {
		var FFContAreaContMenu = document.getElementById('contentAreaContextMenu');
		FFContAreaContMenu.removeEventListener("popupshowing", 
			ZutiloChrome.firefoxOverlay.refreshContentAreaContextMenu, false);
	}
	
	//////////////////////////////////////////////////////////////////////////////////
	// Attach link functions
	//////////////////////////////////////////////////////////////////////////////////
	
	/* Attach the file located at url to the currently selected item in Zotero.
	
		url: string with url to attach
		processType: string mode to use for processing the attachment.  If unspecified,
			determine from Zutilo preferences and mimeType
			Possible values....
			Zotero: use Zotero's default import and filenaming.
			prompt: prompt the user for a file location, import attach with Zotero, and 
				then move the attachment to the file location and change to linked file
				attachment
			ZotFile: import using Zotero and then pass the attachment to 
				ZotFile.renameAttachment()
	*/
	function attachURLToCurrentItem(url, processType) {
		// Error check item selection and get Zotero item
		var zitems = ZutiloChrome.zoteroOverlay.getSelectedItems('regular');
		if (!ZutiloChrome.zoteroOverlay.checkItemNumber(zitems,'regularSingle')) {
			return
		}
		var zitem = zitems[0];
		
		this.attachURLToItem(zitem, url, processType);
	}
	
	function attachURLToItem(zitem, url, processType) {
		var allowedProcesses = ['prompt','Zotero','promptAfterOne'];
		if (allowedProcesses.indexOf(processType) == -1) {
			processType = Zutilo.Prefs.get('attachmentImportProcessType');
		}
		
		//Prompt if there is an existing non-snapshot attachment
		if (processType == 'promptAfterOne') {
			var attachments = Zotero.Items.get(zitem.getAttachments(false));
			var existingAttachments = false;
			// Check for existing non-snapshot attachments
			for (var index=0; index<attachments.length; index++) {
				if (!(attachments[index].attachmentLinkMode == 
					Zotero.Attachments.LINK_MODE_IMPORTED_URL &&
					attachments[index].attachmentMIMEType != 'application/pdf')) {
					existingAttachments = true;
					break
				}
			}
			if (existingAttachments) {
				processType = 'prompt';
			} else {
				processType = 'Zotero';
			}
		}
		
		Zotero.MIME.getMIMETypeFromURL(url, function (mimeType, hasNativeHandler) {
			function zoteroImport(attachmentCallback) {
				Zotero.Attachments.importFromURL(url, zitem.id, undefined, undefined, 
					undefined, mimeType, undefined, attachmentCallback);
			}
		
			// Choose process type for mimeType
			if (processType == 'prompt') {
			// Prompt for file name and location
				zoteroImport(function(attachmentItem) {
					var nsIFilePicker = Components.interfaces.nsIFilePicker;
					var fp = Components.classes["@mozilla.org/filepicker;1"]
						.createInstance(nsIFilePicker);
					fp.init(window, 
						Zutilo._bundle.
							GetStringFromName("zutilo.attachments.selectDestination"), 
						nsIFilePicker.modeSave);
					fp.appendFilters(nsIFilePicker.filterAll);
					
					var importedFile = attachmentItem.getFile();
					fp.defaultString = adjustZoteroExtension(url, importedFile.leafName);
					
					fp.open(function(result) {
						if (result == nsIFilePicker.returnOK) {
							// Move attachment file to chosen directory and attach as 
							// linked file.
							importedFile.moveTo(fp.file.parent, fp.file.leafName);
							Zotero.Attachments.linkFromFile(fp.file, zitem.itemID);
						}
						attachmentItem.erase();
					});
				});
			} else if (processType == 'Zotero') {
			// Use Zotero importFromURL()
				zoteroImport(function() {});
			}
		});
	}
	
	function adjustZoteroExtension(url, zoteroFileName) {
		/* Zotero compresses file extensions based on MIME type (e.g. all 
		text files get converted to ".txt".  Here we try to put back the 
		original extension if it can be guessed from the URL.  We have to be 
		conservative though because sometimes URL's are misleading (e.g. pdf's on 
		arxiv.org whose urls don't include the "pdf" part) and Zotero gets 
		them right by looking at the MIME type. */
		var extensionPosition = url.lastIndexOf('.');
		var urlExtension = 
			extensionPosition == -1 ? '' : url.substr(extensionPosition+1);
		if (urlExtension.length == 3 || urlExtension.length == 4) {
			var re = RegExp('[a-z]','i');
			if (re.test(urlExtension[0])) {
				zoteroFileName = zoteroFileName.substr(0,
					zoteroFileName.lastIndexOf('.')) + '.' + urlExtension;
			}
		}
		
		return zoteroFileName
	}
	
	//////////////////////////////////////////////////////////////////////////////////
	// Status bar icon functions
	//////////////////////////////////////////////////////////////////////////////////
	function getStatusPopup() {
		var statusPopupEl = document.getElementById("zotero-status-image-context");
		// For version > 4.0.26.1
		if (!statusPopupEl) {
			var statusButton = document.getElementById('zotero-toolbar-save-button');
			statusPopupEl = statusButton.children[0];
		}

		return statusPopupEl
	}
	function setupStatusPopup() {
		var statusPopupEl = getStatusPopup();
		statusPopupEl.addEventListener('popupshowing',statusPopupListener,false);
		
		ZutiloChrome.firefoxOverlay.cleanupQueue.push(cleanupStatusPopup);
	}
	
	function cleanupStatusPopup() {
		var statusPopupEl = getStatusPopup();
		if (statusPopupEl) {
			statusPopupEl.removeEventListener('popupshowing',statusPopupListener,false);
			ZutiloChrome.removeLabeledChildren(statusPopupEl, 
				'zutilo-zoterostatuspopup-');
		}
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
		var prefFilesBool = Zotero.Prefs.get('downloadAssociatedFiles');
		if (filesBool !== true && filesBool !== false) {
			filesBool = !prefFilesBool;
		}
		if (ZutiloChrome.firefoxOverlay.scrapeQueue.count > 0 ) {
			// Don't allow mulitple scrapes at all right now because Zotero doesn't 
			// handle them.  When it does, add the condition below
			//&& filesBool != ZutiloChrome.firefoxOverlay.scrapeQueue.currentFilesBool) {
			/*
			Don't allow multiple simultaneous instances of scrapeThisPage() that
			involve a changed value for the downloadAssociatedFiels preference. 
			Because translation is performed asynchronously, multiple instances of
			scrapeThisPage() each setting the downloadAssociatedFiles preference
			could produce erratic results
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
			if (ZutiloChrome.firefoxOverlay.scrapeQueue.count == 0) {
				ZutiloChrome.firefoxOverlay.scrapeQueue.originalFilesBool = prefFilesBool;
				ZutiloChrome.firefoxOverlay.scrapeQueue.currentFilesBool = filesBool;
				if (prefFilesBool != filesBool) {
					Zotero.Prefs.set('downloadAssociatedFiles',filesBool);
				}
			}
			ZutiloChrome.firefoxOverlay.scrapeQueue.count++;
			
			var doneHandler = function(obj, status) {
				ZutiloChrome.firefoxOverlay.scrapeQueue.count--;
				if (ZutiloChrome.firefoxOverlay.scrapeQueue.count == 0 && 
					ZutiloChrome.firefoxOverlay.scrapeQueue.currentFilesBool != 
					ZutiloChrome.firefoxOverlay.scrapeQueue.originalFilesBool) {
					Zotero.Prefs.set('downloadAssociatedFiles',
						ZutiloChrome.firefoxOverlay.scrapeQueue.originalFilesBool);
				}
			};
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
			//MODIFICATION: the following line was added to hack around a bug in Zotero
			if (!itemProgress) return
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

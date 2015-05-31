/* Copyright 2012 Will Shanks.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';
/* global gBrowser, window, document, Components */
/* global Zotero, ZoteroPane */
/* global Zutilo, ZutiloChrome */
Components.utils.import('resource://gre/modules/Services.jsm');
Components.utils.import('chrome://zutilo/content/zutilo.jsm');

ZutiloChrome.zoteroOverlay = {
    /******************************************/
    // Window load handling
    /******************************************/
    init: function() {
        this.fullOverlay();

        if (Zutilo.appName == 'Firefox') {
            gBrowser.addEventListener('load',
                ZutiloChrome.zoteroOverlay.pageloadListener, true);
        }
    },

    unload: function() {
        if (Zutilo.appName == 'Firefox') {
            gBrowser.removeEventListener('load',
                ZutiloChrome.zoteroOverlay.pageloadListener, true);
        }
    },

    /******************************************/
    // Functions for GUI keyboard shortcuts
    /******************************************/
    editItemInfoGUI: function() {
        var zitems = this.getSelectedItems('regular');
        if (!this.checkItemNumber(zitems, 'regularSingle')) {
            return false;
        }

        // Select info tab of item pane
        var tabIndex = 0;
        var zoteroViewTabbox =
            ZoteroPane.document.getElementById('zotero-view-tabbox');
        zoteroViewTabbox.selectedIndex = tabIndex;
        // Focus first entry textbox of info pane
        ZoteroPane.document.getElementById('zotero-editpane-item-box').
            focusFirstField('info');

        return true;
    },

    addNoteGUI: function() {
        var zitems = this.getSelectedItems('regular');
        if (!this.checkItemNumber(zitems, 'regularSingle')) {
            return false;
        }

        // Select note tab of item pane
        var tabIndex = 1;
        var zoteroViewTabbox =
            ZoteroPane.document.getElementById('zotero-view-tabbox');
        zoteroViewTabbox.selectedIndex = tabIndex;
        // Create new note
        ZoteroPane.newNote(false, zitems[0].id);
        // This version didn't work in tab mode:
        // ZoteroItemPane.addNote(false);

        return true;
    },

    addTagGUI: function() {
        var zitems = this.getSelectedItems('regular');
        if (!this.checkItemNumber(zitems, 'regularSingle')) {
            return false;
        }

        // Select tag tab of item pane
        var tabIndex = 2;
        var zoteroViewTabbox =
            ZoteroPane.document.getElementById('zotero-view-tabbox');
        zoteroViewTabbox.selectedIndex = tabIndex;
        // Focus new tag entry textbox
        ZoteroPane.document.getElementById('zotero-editpane-tags').new();

        return true;
    },

    addRelatedGUI: function() {
        var zitems = this.getSelectedItems('regular');
        if (!this.checkItemNumber(zitems, 'regularSingle')) {
            return false;
        }

        // Select related tab of item pane
        var tabIndex = 3;
        var zoteroViewTabbox =
            ZoteroPane.document.getElementById('zotero-view-tabbox');
        zoteroViewTabbox.selectedIndex = tabIndex;
        // Open add related window
        ZoteroPane.document.getElementById('zotero-editpane-related').add();

        return true;
    },

    showItemPane: function() {
        var itemPane = ZoteroPane.document.getElementById('zotero-item-pane');
        if (itemPane.getAttribute('collapsed') == 'true') {
            itemPane.setAttribute('collapsed', 'false');
            ZoteroPane.document.getElementById('zotero-items-splitter').
                removeAttribute('state');
        }
    },

    updatePaneVisibility: function(paneName, command, keepSplitter) {
        var pane = ZoteroPane.document.getElementById(paneName + '-pane');
        // It is zotero-item-pane but zotero-items-splitter
        var splitterStr
        if (paneName == 'zotero-item') {
            splitterStr = 's-splitter'
        } else {
            splitterStr = '-splitter'
        }
        var splitter = ZoteroPane.document.getElementById(paneName +
                                                          splitterStr);

        switch (command) {
            case 'toggle':
                if (pane.collapsed) {
                    this.updatePaneVisibility(paneName, 'show', keepSplitter);
                } else {
                    this.updatePaneVisibility(paneName, 'hide', keepSplitter);
                }
                break;
            case 'show':
                pane.collapsed = false;
                if (!keepSplitter) {
                    splitter.removeAttribute('state');
                }
                break;
            case 'hide':
                pane.collapsed = true;
                splitter.setAttribute('state', 'collapsed');
                break;
        }
    },

    /******************************************/
    // Functions called from Zotero item menu
    /******************************************/
    copyCreators: function() {
        var zitems = this.getSelectedItems('regular');

        if (!this.checkItemNumber(zitems, 'regular1')) {
            return false;
        }

        var creatorsArray = [];
        for (var i = 0; i < zitems.length; i++) {
            var tempCreators = zitems[i].getCreators();
            var arrayStr = '';
            for (var j = 0; j < tempCreators.length; j++) {
                arrayStr = '\n' + creatorsArray.join('\n') + '\n';
                var tempName = tempCreators[j].ref.lastName;
                tempName += '\t' + tempCreators[j].ref.firstName;
                tempName = tempName.replace(/^\s+|\s+$/g, '') ;
                if (arrayStr.indexOf('\n' + tempName + '\n') == -1) {
                    creatorsArray.push(tempName);
                }
            }
        }
        var clipboardText = creatorsArray.join('\r\n');

        const gClipboardHelper =
            Components.classes['@mozilla.org/widget/clipboardhelper;1']
            .getService(Components.interfaces.nsIClipboardHelper);
        gClipboardHelper.copyString(clipboardText, document);

        return true;
    },

    copyTags: function() {
        var zitems = this.getSelectedItems(['regular', 'note']);

        if (!this.checkItemNumber(zitems, 'regularOrNote1')) {
            return false;
        }

        var tagsArray = [];
        for (var i = 0; i < zitems.length; i++) {
            // The following line might be needed to work around some item
            // handling issues, but I will leave it out for now.
            // var tempID = Zotero.Items.getLibraryKeyHash(zitems[i]);
            var tempTags = zitems[i].getTags();
            var arrayStr = '';
            for (var j = 0; j < tempTags.length; j++) {
                arrayStr = '\n' + tagsArray.join('\n') + '\n';
                if (arrayStr.indexOf('\n' + tempTags[j].name + '\n') == -1) {
                    tagsArray.push(tempTags[j].name);
                }
            }
        }
        var clipboardText = tagsArray.join('\r\n');

        const gClipboardHelper =
            Components.classes['@mozilla.org/widget/clipboardhelper;1']
            .getService(Components.interfaces.nsIClipboardHelper);
        gClipboardHelper.copyString(clipboardText, document);

        return true;
    },
	
	removeTags: function() {
        var zitems = this.getSelectedItems(['regular', 'note']);

        if (!this.checkItemNumber(zitems, 'regularOrNote1')) {
            return false;
        }

		for (let idx = 0; idx < zitems.length; idx++) {
			zitems[idx].removeAllTags()
		}
	},

    copyChildIDs: function() {
        var zitems = this.getSelectedItems(['note', 'attachment']);
        if (zitems.length === 0) {
            return 0;
        }

        Zutilo.itemClipboard = [];
        for (var idx = 0; idx < zitems.length; idx++) {
            Zutilo.itemClipboard.push(zitems[idx].id);
        }
    },

    relocateChildren: function() {
        var zitems = this.getSelectedItems(['regular']);

        if (!this.checkItemNumber(zitems, 'regularSingle')) {
            return false;
        }
        var newParent = zitems[0];

        var child;
        for (var idx = 0; idx < Zutilo.itemClipboard.length; idx++) {
            child = Zotero.Items.get(Zutilo.itemClipboard[idx]);
            child.setSource(newParent.id);
            child.save();
        }
    },

    pasteTags: function() {
        var zitems = this.getSelectedItems(['regular', 'note']);

        if (!this.checkItemNumber(zitems, 'regularOrNote1')) {
            return false;
        }

        var clipboardText = ZutiloChrome.getFromClipboard();
        if (!clipboardText) {
            return false;
        }

        var tagArray = clipboardText.split(/\r\n?|\n/);

        for (var i = 0; i < zitems.length; i++) {
            // The following line might be needed to work around some item
            // handling issues, but I will leave it out for now.
            // var tempID = Zotero.Items.getLibraryKeyHash(zitems[i]);
            zitems[i].addTags(tagArray);
        }

        return true;
    },

    modifyAttachments: function() {
        var attachmentArray = this.getSelectedAttachments();

        if (!this.checkItemNumber(attachmentArray, 'attachment1')) {
            return false;
        }
        var prompts = Components.
            classes['@mozilla.org/embedcomp/prompt-service;1'].
            getService(Components.interfaces.nsIPromptService);
        var promptTitle =
            Zutilo._bundle.GetStringFromName('zutilo.attachments.modifyTitle');

        // Prompt for old path
        var promptText = { value: '' };
        var checkGlobal = { value: false };
        var pressedOK = prompts.prompt(null, promptTitle,
            Zutilo._bundle.GetStringFromName('zutilo.attachments.oldPath'),
            promptText,
            Zutilo._bundle.
                GetStringFromName('zutilo.attachments.checkGlobally'),
                                  checkGlobal);
        var oldPath = promptText.value;
        if (!pressedOK || (oldPath === '')) {
            return false;
        }

        // Prompt for new path
        promptText = { value: '' };
        pressedOK = prompts.prompt(null, promptTitle,
            Zutilo._bundle.GetStringFromName('zutilo.attachments.newPath'),
            promptText, null, {});
        var newPath = promptText.value;
        if (!pressedOK) {
            return false;
        }

        // Loop through attachments and replace partial paths
        var attachmentPath;
        for (var index = 0; index < attachmentArray.length; index++) {
            attachmentPath = attachmentArray[index].attachmentPath;
            if (checkGlobal.value) {
                attachmentArray[index].attachmentPath =
                    attachmentPath.replace(
                        new RegExp(Zutilo.escapeForRegExp(oldPath), 'g'),
                        newPath);
            } else {
                // If only check beginning of strings, just do quick compare
                // and substitution (I think this might be faster than
                // replace() ).
                if (attachmentPath.substr(0, oldPath.length) == oldPath) {
                    attachmentArray[index].attachmentPath =
                        newPath + attachmentPath.substr(oldPath.length);
                }
            }
            // attachmentPath stores the unmodified path
            // only save to database if path was actually modified
            if (attachmentArray[index].attachmentPath != attachmentPath) {
                attachmentArray[index].save();
            }
        }

        return true;
    },

    showAttachments: function() {
        var attachmentArray = this.getSelectedAttachments();

        if (!this.checkItemNumber(attachmentArray, 'attachment1')) {
            return false;
        }

        var prompts = Components.
            classes['@mozilla.org/embedcomp/prompt-service;1'].
            getService(Components.interfaces.nsIPromptService);
        for (var index = 0; index < attachmentArray.length; index++) {
            var title = Zutilo._bundle.
                formatStringFromName('zutilo.attachments.showTitle',
                [index + 1, attachmentArray.length], 2);
            prompts.alert(null, title, attachmentArray[index].attachmentPath);
        }
        return true;
    },

    relateItems: function() {
        var zitems = this.getSelectedItems(['regular', 'note']);

        if (!this.checkItemNumber(zitems, 'regularOrNote2')) {
            return false;
        }

        var ids = [];
        for (var ii = 0; ii < zitems.length; ii++) {
            ids[ii] = zitems[ii].id;
        }
        for (ii = 0; ii < zitems.length; ii++) {
            for (var jj = 0; jj < ids.length; jj++) {
                if (ii != jj) {
                    zitems[ii].addRelatedItem(ids[jj]);
                }
            }
        }

        return true;
    },

    copyItems: function() {
        ZoteroPane.copySelectedItemsToClipboard(false);
        return true;
    },

    copyZoteroSelectLink: function() {
        var zitems = this.getSelectedItems();
        var links = [];

        if (!this.checkItemNumber(zitems, 'regularOrNote1')) {
            return false;
        }

        var libraryID;
        for (var ii = 0; ii < zitems.length; ii++) {
            libraryID = zitems[ii].libraryID ? zitems[ii].libraryID : 0;
            links.push('zotero://select/items/' +
                       libraryID + '_' + zitems[ii].key);
        }

        var clipboardText = links.join('\r\n');

        const gClipboardHelper =
            Components.classes['@mozilla.org/widget/clipboardhelper;1']
            .getService(Components.interfaces.nsIClipboardHelper);
        gClipboardHelper.copyString(clipboardText, document);

        return true;
    },

    copyZoteroItemURI: function() {
        var zitems = this.getSelectedItems();
        var links = [];

        if (!this.checkItemNumber(zitems, 'regularOrNote1')) {
            return false;
        }

        for (var ii = 0; ii < zitems.length; ii++) {
            links.push(Zotero.URI.getItemURI(zitems[ii]));
        }

        var clipboardText = links.join('\r\n');

        const gClipboardHelper =
            Components.classes['@mozilla.org/widget/clipboardhelper;1']
            .getService(Components.interfaces.nsIClipboardHelper);
        gClipboardHelper.copyString(clipboardText, document);

        return true;
    },

    createBookSection: function() {
        // Validate item selection
        var zitems = this.getSelectedItems();

        if (!this.checkItemNumber(zitems, 'regularSingle')) {
            return false;
        }

        var bookItem = zitems[0];
        if (bookItem.itemTypeID != Zotero.ItemTypes.getID('book')) {
            var prompts =
                Components.classes['@mozilla.org/embedcomp/prompt-service;1'].
                getService(Components.interfaces.nsIPromptService);
            prompts.alert(null,
                Zutilo._bundle.
                    GetStringFromName('zutilo.error.bookitemtitle'),
                Zutilo._bundle.
                    GetStringFromName('zutilo.error.bookitemmessage'));
            return false;
        }

        // Duplicate item
        ZoteroPane.duplicateSelectedItem();

        // Set item type
        zitems = this.getSelectedItems();
        var sectionItem = zitems[0];
        sectionItem.setType(Zotero.ItemTypes.getID('bookSection'));

        // Change authors to book authors
        var creators = sectionItem.getCreators();
        for (var index = 0; index < creators.length; index++) {
            if (creators[index].creatorTypeID ==
                    Zotero.CreatorTypes.getID('author')) {
                creators[index] = Zotero.CreatorTypes.getID('bookAuthors');
            }
        }

        sectionItem.save();

        // Relate items
        bookItem.addRelatedItem(sectionItem.id);
        sectionItem.addRelatedItem(bookItem.id);

        // Update GUI and select textbox
        document.getElementById('zotero-editpane-item-box').refresh();
        this.editItemInfoGUI();

        return true;
    },

    createBookItem: function() {
        // Validate item selection
        var zitems = this.getSelectedItems();

        if (!this.checkItemNumber(zitems, 'regularSingle')) {
            return false;
        }

        var sectionItem = zitems[0];
        if (sectionItem.itemTypeID != Zotero.ItemTypes.getID('bookSection')) {
            var prompts =
                Components.classes['@mozilla.org/embedcomp/prompt-service;1'].
                getService(Components.interfaces.nsIPromptService);
            prompts.alert(null,
                Zutilo._bundle.
                    GetStringFromName('zutilo.error.booksectiontitle'),
                Zutilo._bundle.
                    GetStringFromName('zutilo.error.booksectionmessage'));
            return false;
        }

        // Duplicate item
        ZoteroPane.duplicateSelectedItem();

        // Set item type
        zitems = this.getSelectedItems();
        var bookItem = zitems[0];
        bookItem.setType(Zotero.ItemTypes.getID('book'));

        // Change book title to title
        var bookTitleField = Zotero.ItemFields.getID('bookTitle');
        var titleField = Zotero.ItemFields.getID('title');
        var bookTitle = sectionItem.getField(bookTitleField);
        if (bookTitle !== '') {
            bookItem.setField(titleField, bookTitle);
        }
		bookItem.setField(Zotero.ItemFields.getID('abstractNote'), '')

        bookItem.save();

        // Relate items
        bookItem.addRelatedItem(sectionItem.id);
        sectionItem.addRelatedItem(bookItem.id);

        // Update GUI and select textbox
        document.getElementById('zotero-editpane-item-box').refresh();
        this.editItemInfoGUI();

        return true;
    },

    /******************************************/
    // XUL overlay functions
    /******************************************/
    fullOverlay: function() {
        // Add all Zutilo overlay elements to the window
        ZutiloChrome.actOnAllDocuments(ZutiloChrome.zoteroOverlay.
                                       overlayZoteroPane);
        this.initKeys();
    },

    overlayZoteroPane: function(doc) {
        ZutiloChrome.zoteroOverlay.zoteroActionsMenu(doc);
        ZutiloChrome.zoteroOverlay.zoteroItemPopup(doc);
    },

    pageloadListener: function(event) {
        if (event.originalTarget.location == Zutilo.zoteroTabURL) {
            ZutiloChrome.zoteroOverlay.overlayZoteroPane(event.originalTarget);
        }
    },

    zoteroActionsMenu: function(doc) {
        // Add Zutilo preferences item to Zotero actions menu
        var zoteroActionMenu = doc.getElementById('zotero-tb-actions-popup');
        if (zoteroActionMenu === null) {
            // Don't do anything if elements not loaded yet
            return;
        }

        var zutiloMenuItem = doc.createElement('menuitem');
        var zutiloMenuItemID = 'zutilo-zotero-actions-preferences';
        zutiloMenuItem.setAttribute('id', zutiloMenuItemID);
        zutiloMenuItem.setAttribute('label',
            Zutilo._bundle.
                GetStringFromName('zutilo.zotero.actions.preferences'));
        zutiloMenuItem.addEventListener('command',
            function() {
                ZutiloChrome.openPreferences();
            }, false);
        var zoteroPrefsItem =
            doc.getElementById('zotero-tb-actions-prefs');
        zoteroActionMenu.insertBefore(zutiloMenuItem,
                                      zoteroPrefsItem.nextSibling);

        ZutiloChrome.registerXUL(zutiloMenuItemID, doc);
    },

    /******************************************/
    // Item menu functions
    /******************************************/
    // Create XUL for Zotero item menu elements
    zoteroItemPopup: function(doc) {
        var zoteroItemmenu = doc.getElementById('zotero-itemmenu');
        if (zoteroItemmenu === null) {
            // Don't do anything if elements not loaded yet
            return;
        }

        var zutiloSeparator = doc.createElement('menuseparator');
        var zutiloSeparatorID = 'zutilo-itemmenu-separator';
        zutiloSeparator.setAttribute('id', zutiloSeparatorID);
        zoteroItemmenu.appendChild(zutiloSeparator);
        ZutiloChrome.registerXUL(zutiloSeparatorID, doc);

        this.createItemmenuItems(zoteroItemmenu, 'zutilo-zoteroitemmenu-',
                                 true, doc);

        // Zutilo submenu
        var zutiloSubmenu = doc.createElement('menu');
        var zutiloSubmenuID = 'zutilo-itemmenu-submenu';
        zutiloSubmenu.setAttribute('id', zutiloSubmenuID);
        zutiloSubmenu.setAttribute('label',
            Zutilo._bundle.GetStringFromName('zutilo.itemmenu.zutilo'));
        zoteroItemmenu.appendChild(zutiloSubmenu);
        ZutiloChrome.registerXUL(zutiloSubmenuID, doc);

        // Zutilo submenu popup
        var zutiloSubmenuPopup = doc.createElement('menupopup');
        zutiloSubmenuPopup.setAttribute('id', 'zutilo-itemmenu-submenupopup');
        zutiloSubmenu.appendChild(zutiloSubmenuPopup);

        this.createItemmenuItems(zutiloSubmenuPopup, 'zutilo-zutiloitemmenu-',
                                 false, doc);

        this.refreshZoteroItemPopup(doc);
    },

    // Update hidden state of Zotero item menu elements
    refreshZoteroItemPopup: function(doc) {
        if (typeof doc == 'undefined') {
            doc = document;
        }
        var showMenuSeparator = false;
        var showSubmenu = false;

        for (var index = 0; index < Zutilo._itemmenuFunctions.length; index++) {
            var prefVal = Zutilo.Prefs.get('itemmenu.' +
                                           Zutilo._itemmenuFunctions[index]);

            var zutiloMenuItem = doc.getElementById(
                'zutilo-zutiloitemmenu-' + Zutilo._itemmenuFunctions[index]);
            var zoteroMenuItem = doc.getElementById(
                'zutilo-zoteroitemmenu-' + Zutilo._itemmenuFunctions[index]);

            if (prefVal == 'Zotero') {
                showMenuSeparator = true;
                zutiloMenuItem.hidden = true;
                zoteroMenuItem.hidden = false;
            } else if (prefVal == 'Zutilo') {
                showMenuSeparator = true;
                showSubmenu = true;
                zutiloMenuItem.hidden = false;
                zoteroMenuItem.hidden = true;
            } else {
                zutiloMenuItem.hidden = true;
                zoteroMenuItem.hidden = true;
            }
        }

        var menuSeparator = doc.getElementById('zutilo-itemmenu-separator');
        if (showMenuSeparator) {
            menuSeparator.hidden = false;
        } else {
            menuSeparator.hidden = true;
        }

        var submenu = doc.getElementById('zutilo-itemmenu-submenu');
        if (showSubmenu) {
            submenu.hidden = false;
        } else {
            submenu.hidden = true;
        }
    },

    // Create Zotero item menu items as children of menuPopup
    createItemmenuItems: function(menuPopup, IDPrefix, elementsAreRoot, doc) {
        var menuFunc;
        for (var index = 0;index < Zutilo._itemmenuFunctions.length;index++) {
            menuFunc = this.zoteroItemmenuItem(
                Zutilo._itemmenuFunctions[index], IDPrefix, doc);
            menuPopup.appendChild(menuFunc);
            if (elementsAreRoot) {
                ZutiloChrome.registerXUL(menuFunc.id, doc);
            }
        }
    },

    // Create Zotero item menu item
    zoteroItemmenuItem: function(functionName, IDPrefix, doc) {
        var menuFunc = doc.createElement('menuitem');
        menuFunc.setAttribute('id', IDPrefix + functionName);
        menuFunc.setAttribute('label',
            Zutilo._bundle.GetStringFromName('zutilo.itemmenu.' +
                                             functionName));
        menuFunc.addEventListener('command',
            function() {
                ZutiloChrome.zoteroOverlay[functionName]();
            }, false);
        return menuFunc;
    },

    /******************************************/
    // Keyboard shortcut functions
    /******************************************/
    initKeys: function() {
        var keyset = document.createElement('keyset');
        this.keyset = keyset;
        this.keyset.setAttribute('id', 'zutilo-keyset');
        document.getElementById('mainKeyset').parentNode.
            appendChild(this.keyset);
        ZutiloChrome.XULRootElements.push(this.keyset.id);

        for (var keyLabel in Zutilo.keys.shortcuts) {
            this.createKey(keyLabel);
        }
    },

    createKey: function(keyLabel) {
        var key = document.createElement('key');
        key.setAttribute('id', Zutilo.keys.keyID(keyLabel));
        this.keyset.appendChild(key);
        // Set label attribute so that keys show up nicely in keyconfig
        // extension
        key.setAttribute('label', 'Zutilo: ' + Zutilo.keys.keyName(keyLabel));
        // key.setAttribute('command', 'zutilo-keyset-command');
        key.setAttribute('oncommand', '//');
        key.addEventListener('command',
            function() {
                Zutilo.keys.shortcuts[keyLabel](window);
            });

        var keyObj = Zutilo.keys.getKey(keyLabel);

        if (keyObj.modifiers) {
            key.setAttribute('modifiers', keyObj.modifiers);
        }
        if (keyObj.key) {
            key.setAttribute('key', keyObj.key);
        } else if (keyObj.keycode) {
            key.setAttribute('key', keyObj.key);
        } else {
            // No key or keycode.  Set to empty string to disable.
            key.setAttribute('key', '');
        }
    },

    updateKey: function(keyLabel) {
        var key = document.getElementById(Zutilo.keys.keyID(keyLabel));

        key.removeAttribute('modifiers');
        key.removeAttribute('key');
        key.removeAttribute('keycode');

        var keyObj = Zutilo.keys.getKey(keyLabel);

        if (keyObj.modifiers) {
            key.setAttribute('modifiers', keyObj.modifiers);
        }
        if (keyObj.key) {
            key.setAttribute('key', keyObj.key);
        } else if (keyObj.keycode) {
            key.setAttribute('key', keyObj.key);
        } else {
            // No key or keycode.  Set to empty string to disable.
            key.setAttribute('key', '');
        }

        // Regenerate keys
        var keyset = this.keyset;
        keyset.parentNode.insertBefore(keyset, keyset.nextSibling);
    },

    /******************************************/
    // Zotero item selection and sorting
    /******************************************/

    // Get all selected attachment items and all of the child attachments of
    // all selected regular items.
    // To get just the selected attachment items, use
    // Zutilo.siftItems(inputArray, 'attachment') instead.
    getSelectedAttachments: function() {

        var zitems = this.getSelectedItems();
        if (!zitems) {
            return [];
        }

        // Add child attachments of all selected regular items to
        // attachmentItems
        var zitem;
        var attachmentItems = [];
        while (zitems.length > 0) {
            zitem = zitems.shift();

            if (zitem.isRegularItem()) {
                attachmentItems =
                    attachmentItems.concat(Zotero.Items.
                                           get(zitem.getAttachments(false)));
            } else if (zitem.isAttachment()) {
                attachmentItems.push(zitem);
            }
        }

        // Return attachments after removing duplicate items (when parent and
        // child are selected)
        return this.removeDuplicateItems(attachmentItems);
    },

    // Return array with the selected item objects.  If itemType is passed,
    // return only items of that type (or types if itemType is an array)
    getSelectedItems: function(itemType) {
        var zitems = window.ZoteroPane.getSelectedItems();
        if (!zitems.length) {
            return false;
        }

        if (itemType) {
            if (!Array.isArray(itemType)) {
                itemType = [itemType];
            }
            var siftedItems = this.siftItems(zitems, itemType);
            return siftedItems.matched;
        } else {
            return zitems;
        }
    },

    checkItemType: function(itemObj, itemTypeArray) {
        var matchBool = false;

        for (var idx = 0; idx < itemTypeArray.length; idx++) {
            switch (itemTypeArray[idx]) {
                case 'attachment':
                    matchBool = itemObj.isAttachment();
                    break;
                case 'note':
                    matchBool = itemObj.isNote();
                    break;
                case 'regular':
                    matchBool = itemObj.isRegularItem();
                    break;
                default:
                    matchBool = Zotero.ItemTypes.getName(itemObj.itemTypeID) ==
                        itemTypeArray[idx];
            }

            if (matchBool) {
                break;
            }
        }

        return matchBool;
    },

    // Remove duplicate Zotero item objects from itemArray
    removeDuplicateItems: function(itemArray) {
        // Get array of itemID's
        var itemIDArray = [];
        for (var index = 0;index < itemArray.length;index++) {
            itemIDArray[index] = itemArray[index].itemID;
        }

        // Create array of unique itemID's
        var tempObject = {};
        var uniqueIDs = [];
        for (index = 0;index < itemIDArray.length;index++) {
            tempObject[itemIDArray[index]] = itemIDArray[index];
        }
        for (index in tempObject) {
            uniqueIDs.push(tempObject[index]);
        }

        return Zotero.Items.get(uniqueIDs);
    },

    // Separate itemArray into an array of items with type itemType and an
    // array with those with different item types
    siftItems: function(itemArray, itemTypeArray) {
        var matchedItems = [];
        var unmatchedItems = [];
        var numItems = itemArray.length;
        while (itemArray.length > 0) {
            if (this.checkItemType(itemArray[0], itemTypeArray)) {
                matchedItems.push(itemArray.shift());
            } else {
                unmatchedItems.push(itemArray.shift());
            }
        }

        return {
            matched: matchedItems,
            unmatched: unmatchedItems
        };
    },

    // Check number of items in itemArray and show error message if it does not
    // match checkType. Note that checkType sets the number to be checked and
    // the error message to display. The actual item types are not checked.
    checkItemNumber: function(itemArray, checkType) {
        var checkBool = true;

        var prompts = Components.
            classes['@mozilla.org/embedcomp/prompt-service;1'].
            getService(Components.interfaces.nsIPromptService);

        var errorTitle = Zutilo._bundle.
            GetStringFromName('zutilo.checkItems.errorTitle');
        switch (checkType) {
            case 'regular1':
            case 'regularOrNote1':
                if (!itemArray.length) {
                    prompts.alert(null, errorTitle, Zutilo._bundle.
                        GetStringFromName('zutilo.checkItems.' + checkType));
                    checkBool = false;
                }
                break;
            case 'regularSingle':
                if ((!itemArray.length) || (itemArray.length > 1)) {
                    prompts.alert(null, errorTitle, Zutilo._bundle.
                        GetStringFromName('zutilo.checkItems.regularSingle'));
                    checkBool = false;
                }
                break;
            case 'regular2':
            case 'regularOrNote2':
                if ((!itemArray.length) || (itemArray.length < 2)) {
                    prompts.alert(null, errorTitle, Zutilo._bundle.
                        GetStringFromName('zutilo.checkItems.' + checkType));
                    checkBool = false;
                }
                break;
            case 'attachment1':
                if (!itemArray.length) {
                    prompts.alert(null, errorTitle, Zutilo._bundle.
                        GetStringFromName('zutilo.checkItems.attachment1'));
                    checkBool = false;
                }
                break;
        }

        return checkBool;
    }
};

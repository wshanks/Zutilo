/* Copyright 2012 Will Shanks.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';
/* global window, document, Components */
/* global Zotero, ZoteroPane, ZOTERO_CONFIG */
/* global Zutilo, ZutiloChrome */
Components.utils.import('resource://gre/modules/Services.jsm');
Components.utils.import('chrome://zutilo/content/zutilo.js');
Components.utils.import('resource://zotero/config.js');

function debug(msg, err) {
    if (err) {
        Zotero.debug(`{Zutilo} ${new Date} error: ${msg} (${err} ${err.stack})`)
    } else {
        Zotero.debug(`{Zutilo} ${new Date}: ${msg}`)
    }
}

// needed as a separate function, because ZutiloChrome.zoteroOverlay.refreshZoteroPopup refers to `this`, and a bind would make it two separate functions in add/remove eventlistener
function refreshZoteroItemPopup() {
  ZutiloChrome.zoteroOverlay.refreshZoteroPopup('item', document)
}
function refreshZoteroCollectionPopup() {
  ZutiloChrome.zoteroOverlay.refreshZoteroPopup('collection', document)
}

ZutiloChrome.zoteroOverlay = {
    /******************************************/
    // Window load handling
    /******************************************/
    init: function() {
        this.fullOverlay();

        document.getElementById('zotero-itemmenu').addEventListener('popupshowing', refreshZoteroItemPopup, false)
        document.getElementById('zotero-collectionmenu').addEventListener('popupshowing', refreshZoteroCollectionPopup, false)
    },

    unload: function() {
        var toolsPopup = document.getElementById('menu_ToolsPopup')
        toolsPopup.removeEventListener('popupshowing',
            ZutiloChrome.zoteroOverlay.prefsSeparatorListener, false)

        document.getElementById('zotero-itemmenu').removeEventListener('popupshowing', refreshZoteroItemPopup, false)
        document.getElementById('zotero-collectionmenu').removeEventListener('popupshowing', refreshZoteroCollectionPopup, false)
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
        ZoteroPane.newNote(false, zitems[0].key)

        return true;
    },

    addTagGUI: function() {
        var zitems = this.getSelectedItems('regular');
        if (!this.checkItemNumber(zitems, 'regularSingle')) {
            return false;
        }

        // Select tag tab of item pane
        var tabIndex = 2
        ZoteroPane.document.getElementById('zotero-view-tabbox').
            tabs.selectedIndex = tabIndex
        // Focus new tag entry textbox
        let header = ZoteroPane.document.querySelector(".tags-box-header")
        if (header === null) {
            // Zotero version < 5.0.78
            let tagPane = ZoteroPane.document.getElementById('zotero-editpane-tags')
            if (tagPane._tagColors === undefined) {
                window.setTimeout(function() {tagPane.new()}, 200)
            } else {
                tagPane.newTag()
            }
        } else {
            let addButton = header.querySelector("button")
            addButton.click()
        }

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
    _copyToClipboard: function(clipboardText) {
        if (clipboardText) {
            const gClipboardHelper =
                Components.classes['@mozilla.org/widget/clipboardhelper;1']
                .getService(Components.interfaces.nsIClipboardHelper);
            gClipboardHelper.copyString(clipboardText, document);
        } else {
            var prompts = Components.
                classes['@mozilla.org/embedcomp/prompt-service;1'].
                getService(Components.interfaces.nsIPromptService);
            var title = Zutilo.getString('zutilo.error.copynoitemstitle')
            var text = Zutilo.getString('zutilo.error.copynoitemstext')
            prompts.alert(null, title, text)
        }
    },

    copyCreators: function() {
        var zitems = this.getSelectedItems('regular');

        if (!this.checkItemNumber(zitems, 'regular1')) {
            return false;
        }

        var creatorsArray = [];
        for (let zitem of zitems) {
            let creators = zitem.getCreators()
            for (let creator of creators) {
                let creatorStr = creator.lastName + '\t' + creator.firstName
                if (creatorsArray.indexOf(creatorStr) == -1) {
                    creatorsArray.push(creatorStr)
                }
            }
        }

        var clipboardText = creatorsArray.join('\r\n');

        this._copyToClipboard(clipboardText)

        return true;
    },

    copyTags: function() {
        var zitems = this.getSelectedItems(['regular', 'note', 'attachment']);

        if (!this.checkItemNumber(zitems, 'regularNoteAttachment1')) {
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

                let tag
                tag = tempTags[j].tag

                if (arrayStr.indexOf('\n' + tag + '\n') == -1) {
                    tagsArray.push(tag);
                }
            }
        }
        var clipboardText = tagsArray.join('\r\n');

        this._copyToClipboard(clipboardText)

        return true;
    },

    removeTags: function() {
        var zitems = this.getSelectedItems(['regular', 'note', 'attachment']);

        if (!this.checkItemNumber(zitems, 'regularNoteAttachment1')) {
            return false;
        }

        for (let idx = 0; idx < zitems.length; idx++) {
            zitems[idx].removeAllTags()
            zitems[idx].saveTx()
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
            child.parentKey = newParent.key
            child.saveTx()
        }
    },

    Collection: new class {
        selected() {
            return window.ZoteroPane.getSelectedCollection();
        }
    },

    CopyItems: new class {
        constructor() {
            // this gets us a BlueBird promise which has isPending
            this.ready = new Zotero.Promise((resolve, reject) => {
                this._init()
                    .then(() => resolve(true))
                    .catch((err) => {
                        debug('CopyItems._init', err)
                        reject(err)
                    })
            })
        }

        async _init() {
            await Zotero.Schema.schemaUpdatePromise

            const baseMapped = Zotero.ItemFields.getBaseMappedFields()
            this.fields = Zotero.ItemFields.getAll().filter((field) => !baseMapped.includes(field.id))
.map((field) => field.name)
        }

        sourceItem() {
            const items = ZutiloChrome.zoteroOverlay.getSelectedItems() || []
            return items.length === 1 && items[0].isRegularItem() ? items[0] : null
        }

        targetItems() {
            const items = (ZutiloChrome.zoteroOverlay.getSelectedItems() || []).filter((item) => item.isRegularItem())
            debug(`targetItems: ${items.length}`)
            return items
        }

        getFieldIDFromTypeAndBase(itemType, field) {
            // isValidForItemType doesn't check base fields and getFieldIDFromTypeAndBase throws an error if the field is not defined on the type... oy vey.
            try {
                return Zotero.ItemFields.getFieldIDFromTypeAndBase(itemType, field)
            } catch (err) {
                return false
            }
        }

        clipboard() {
            const clipboard = ZutiloChrome.getFromClipboard(true).trim()
            debug(`clipboard: ${clipboard}`)
            if (!clipboard || !clipboard.startsWith('{')) return null

            try {
                const item = JSON.parse(clipboard)
                if (!item.itemType) throw new Error(`${clipboard} does not look like a Zotero item`)
                return item
            } catch (err) {
                debug('Not valid JSON on clipboard', err)
            }
            return null
        }
    },

    copyJSON: function() {
        this._copyJSON().catch((err) => debug('copyJSON', err))
    },
    _copyJSON: async function() {
        await this.CopyItems.ready

        const sourceItem = this.CopyItems.sourceItem()
        if (!sourceItem) {
            debug('Unexpected call to copyItem2JSON: no regular item selected')
            return
        }

        const item = Zotero.Utilities.Internal.itemToExportFormat(sourceItem)

        // normalize all fields to base fields for easier copying
        for (const field of Object.keys(item)) {
            if (['itemType', 'creators'].includes(field)) continue

            // OK to use isValidForType because the fields are non-basefields here and all the rest we want to get rid of anyhow
            if (!Zotero.ItemFields.isValidForType(field, sourceItem.itemTypeID)) {
                debug(`stripping ${item.itemType}.${field}`)
                delete item[field]
                continue
            }

            const baseID = Zotero.ItemFields.getBaseIDFromTypeAndField(sourceItem.itemTypeID, field)
            if (baseID === false) continue
            const baseField = Zotero.ItemFields.getName(baseID)
            if (baseField !== field) {
                item[baseField] = item[field]
                delete item[field]
            }
        }

        // add missing fields -- '' if it could have been present on the item, null if not, so that inspection of the JSON object tells you about what you can expect for the itemType
        for (const field of this.CopyItems.fields) {
          if (item.hasOwnProperty(field)) continue
          item[field] = this.CopyItems.getFieldIDFromTypeAndBase(sourceItem.itemTypeID, field) ? '' : null
        }

        this._copyToClipboard(JSON.stringify(item, null, 2))
    },

    pasteJSONIntoEmptyFields: function() {
        debug('pasteJSONIntoEmptyFields')
        this.pasteJSON('into-empty-fields').catch((err) => debug('pasteJSONIntoEmptyFields', err))
    },
    pasteJSONFromNonEmptyFields: function() {
        debug('pasteJSONFromNonEmptyFields')
        this.pasteJSON('from-non-empty-fields').catch((err) => debug('pasteJSONFromNonEmptyFields', err))
    },
    pasteJSONAll: function() {
        debug('pasteJSONAll')
        this.pasteJSON('all').catch((err) => debug('pasteJSONAll', err))
    },
    pasteJSON: async function(mode) {
        await this.CopyItems.ready

        const copiedItem = this.CopyItems.clipboard()
        if (!copiedItem) {
            debug('Unexpected call to pasteJSON: no item on clipboard')
            return
        }
        const items = this.CopyItems.targetItems()
        if (!items.length) {
            debug('Unexpected call to pasteJSON: no target items selected')
            return
        }

        function creatorID(creator) {
            return JSON.stringify(['creatorType', 'name', 'firstName', 'lastName'].map((field) => creator[field] || ''))
        }

        for (const item of items) {
            let save = false

            for (const [field, value] of Object.entries(copiedItem)) {
                const fieldID = this.CopyItems.getFieldIDFromTypeAndBase(item.itemTypeID, field)
                debug(`${item.itemTypeID}.${field} = ${value}: valid = ${fieldID}`)

                if (field ===  'creators') {
                    let creators
                    let creatorIDs
                    let newCreators
                    switch (mode) {
                        case 'into-empty-fields':
                            creators = item.getCreators().map((creator) => {
                              if (creator.fieldMode === 1) {
                                return {
                                  creatorType: Zotero.CreatorTypes.getName(creator.creatorTypeID),
                                  name: creator.name || creator.lastName || ''
                                }
                              }
                              return {
                                creatorType: Zotero.CreatorTypes.getName(creator.creatorTypeID),
                                firstName: creator.firstName || '',
                                lastName: creator.lastName || ''
                              }
                            })
                            creatorIDs = (creators || []).map(creatorID)
                            newCreators = value.filter((creator) => !creatorIDs.includes(creatorID(creator)))

                            if (!newCreators.length) continue

                            creators = creators.concat(newCreators)
                            break

                        case 'from-non-empty-fields':
                            if (!value.length) continue

                            creators = value
                            break

                        case 'all':
                            creators = value
                            break
                    }

                    item.setCreators([]) // clears existing
                    item.setCreators(creators)
                    save = true

                } else if (fieldID !== false) {

                    const fieldName = Zotero.ItemFields.getName(fieldID)
                    const currentValue = item.getField(fieldName, true, true)

                    const isEmpty = {
                        source: typeof value !== 'number' && typeof value !== 'boolean' && !value,
                        target: typeof currentValue !== 'number' && typeof value !== 'boolean' && !currentValue
                    }

                    switch (mode) {
                        case 'into-empty-fields':
                            if (isEmpty.source || !isEmpty.target) continue

                            break

                        case 'from-non-empty-fields':
                            if (isEmpty.source) continue

                            break

                        case 'all':
                            break

                    }

                    item.setField(fieldName, isEmpty.source ? '' : value)
                    save = true
                }
            }

            debug(`pasteJSON: ${item.id}, save: ${save}`)
            if (save) await item.saveTx()
        }
    },

    pasteTags: function() {
        var zitems = this.getSelectedItems(['regular', 'note', 'attachment']);

        if (!this.checkItemNumber(zitems, 'regularNoteAttachment1')) {
            return false;
        }

        var clipboardText = ZutiloChrome.getFromClipboard().trim()
        if (!clipboardText) {
            return false;
        }

        var tagArray = clipboardText.split(/\r\n?|\n/)
        tagArray = tagArray.map(function(val) {return val.trim()});
        tagArray = tagArray.filter(Boolean)

        for (let zitem of zitems) {
            for (let tag of tagArray) {
                zitem.addTag(tag)
            }
            zitem.saveTx()
        }

        return true;
    },

    _modifyAttachmentPaths: function(mode) {
        var attachmentArray = this.getSelectedAttachments(mode);

        if (!this.checkItemNumber(attachmentArray, 'attachment1')) {
            return false;
        }
        var prompts = Components.
            classes['@mozilla.org/embedcomp/prompt-service;1'].
            getService(Components.interfaces.nsIPromptService);
        var promptTitle
        if (mode == Zotero.Attachments.LINK_MODE_LINKED_FILE) {
            promptTitle = Zutilo.getString('zutilo.attachments.modifyTitle')
        } else if (mode == Zotero.Attachments.LINK_MODE_LINKED_URL) {
            promptTitle = Zutilo.getString('zutilo.attachments.modifyURLTitle')
        }

        // Prompt for old path
        var promptText = { value: '' };
        var checkGlobal = { value: false };
        var pressedOK = prompts.prompt(
            null,
            promptTitle,
            Zutilo.getString('zutilo.attachments.oldPath'),
            promptText,
            Zutilo.getString('zutilo.attachments.checkGlobally'),
            checkGlobal
        )
        var oldPath = promptText.value;
        if (!pressedOK || (oldPath === '')) {
            return false;
        }

        // Prompt for new path
        promptText = { value: '' };
        pressedOK = prompts.prompt(
            null,
            promptTitle,
            Zutilo.getString('zutilo.attachments.newPath'),
            promptText,
            null,
            {}
        )
        var newPath = promptText.value;
        if (!pressedOK) {
            return false;
        }

        function getPath(attachment) {
            if (mode == Zotero.Attachments.LINK_MODE_LINKED_FILE) {
                return attachment.attachmentPath
            } else if (mode == Zotero.Attachments.LINK_MODE_LINKED_URL) {
                return attachment.getField('url')
            }
        }

        function setPath(attachment, path) {
            if (mode == Zotero.Attachments.LINK_MODE_LINKED_FILE) {
                attachment.attachmentPath = path
            } else if (mode == Zotero.Attachments.LINK_MODE_LINKED_URL) {
                attachment.setField('title', path)
                attachment.setField('url', path)
            }
        }

        // Loop through attachments and replace partial paths
        var newFullPath
        for (var index = 0; index < attachmentArray.length; index++) {
            // Only modify linked file attachments since paths for the other
            // attachment types are managed by Zotero.
            if (attachmentArray[index].attachmentLinkMode != mode) {
                continue
            }
            var oldFullPath = getPath(attachmentArray[index])
            if (checkGlobal.value) {
                newFullPath =
                    oldFullPath.replace(
                        new RegExp(Zutilo.escapeForRegExp(oldPath), 'g'),
                        newPath);
            } else {
                // If only check beginning of strings, just do quick compare
                // and substitution (I think this might be faster than
                // replace() ).
                if (oldFullPath.substr(0, oldPath.length) == oldPath) {
                    newFullPath =
                        newPath + oldFullPath.substr(oldPath.length);
                } else {
                    newFullPath = oldFullPath
                }
            }
            // attachmentPath stores the unmodified path
            // only save to database if path was actually modified
            if (newFullPath != oldFullPath) {
                // TODO: wrap all saves in one transaction
                setPath(attachmentArray[index], newFullPath)
                attachmentArray[index].saveTx();
            }
        }

        return true;
    },

    modifyAttachments: function() {
        this._modifyAttachmentPaths(Zotero.Attachments.LINK_MODE_LINKED_FILE)
    },

    modifyURLAttachments: function() {
        this._modifyAttachmentPaths(Zotero.Attachments.LINK_MODE_LINKED_URL)
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
            var text
            if (attachmentArray[index].attachmentLinkMode ==
                    Zotero.Attachments.LINK_MODE_LINKED_URL) {
                text = attachmentArray[index].getField('url')
            } else {
                text = attachmentArray[index].attachmentPath
            }
            prompts.alert(null, title, text);
        }
        return true;
    },

    copyAttachmentPaths: function() {
        var attachmentArray = this.getSelectedAttachments();

        if (!this.checkItemNumber(attachmentArray, 'attachment1')) {
            return false;
        }

        var paths = []
        for (let attachment of attachmentArray) {
            let path
            path = attachment.getFilePath()
            if (path) {
                paths.push(path)
            }
        }

        if (paths.length > 0) {
            var clipboardText = paths.join('\r\n')

            this._copyToClipboard(clipboardText)
        }

        return true;
    },

    relateItems: function() {
        var zitems = this.getSelectedItems(['regular', 'note', 'attachment']);

        if (!this.checkItemNumber(zitems, 'regularNoteAttachment2')) {
            return false;
        }

        for (let zitem of zitems) {
            for (let addItem of zitems) {
                if (zitem != addItem) {
                    zitem.addRelatedItem(addItem)
                }
            }
            zitem.saveTx()
        }

        return true;
    },

    copyItems: function() {
        ZoteroPane.copySelectedItemsToClipboard(false);
        return true;
    },

    copyItems_alt: function(altNum) {
        var pref = 'export.quickCopy.setting'
        var origSetting = Zotero.Prefs.get(pref)
        var newSetting = Zutilo.Prefs.get('quickCopy_alt' + altNum)
        Zotero.Prefs.set(pref, newSetting)
        ZoteroPane.copySelectedItemsToClipboard(false)
        Zotero.Prefs.set(pref, origSetting)
        return true
    },

    copyZoteroCollectionSelectLink: function() {
        const collection = ZutiloChrome.zoteroOverlay.Collection.selected()
        if (!collection) return

        if (collection.libraryID === Zotero.Libraries.userLibraryID) {
          this._copyToClipboard(`zotero://select/library/collections/${collection.key}`)
        } else {
          this._copyToClipboard(`zotero://select/groups/${Zotero.Groups.getGroupIDFromLibraryID(collection.libraryID)}/collections/${collection.key}`)
        }
    },

    copyZoteroCollectionURI: function() {
        const collection = ZutiloChrome.zoteroOverlay.Collection.selected()
        if (!collection) return
        this._copyToClipboard(Zotero.URI.getCollectionURI(collection))
    },

    copyZoteroSelectLink: function() {
        var zitems = this.getSelectedItems();
        var links = [];

        if (!this.checkItemNumber(zitems, 'regularNoteAttachment1')) {
            return false;
        }

        var libraryType
        var path
        for (var ii = 0; ii < zitems.length; ii++) {

            libraryType = Zotero.Libraries.get(zitems[ii].libraryID).libraryType

            switch (libraryType) {
                case 'group':
                    path = Zotero.URI.getLibraryPath(zitems[ii].libraryID)
                    break;
                case 'user':
                    path = 'library'
                    break;
                default:
                    // Feeds?
                    continue
            }

            links.push('zotero://select/' + path + '/items/'+ zitems[ii].key)
        }

        var clipboardText = links.join('\r\n');

        this._copyToClipboard(clipboardText)

        return true;
    },

    copyZoteroItemURI: function() {
        var zitems = this.getSelectedItems();
        var links = [];

        if (!this.checkItemNumber(zitems, 'regularNoteAttachment1')) {
            return false;
        }

        var link
        for (var ii = 0; ii < zitems.length; ii++) {
            link = Zotero.URI.getItemURI(zitems[ii])
            if (link.startsWith(ZOTERO_CONFIG.BASE_URI)) {
                link = (ZOTERO_CONFIG.WWW_BASE_URL +
                        link.slice(ZOTERO_CONFIG.BASE_URI.length))
            }
            links.push(link)
        }

        var clipboardText = links.join('\r\n');

        this._copyToClipboard(clipboardText)

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
            prompts.alert(
                null,
                Zutilo.getString('zutilo.error.bookitemtitle'),
                Zutilo.getString('zutilo.error.bookitemmessage')
            )
            return false;
        }

        function modifyNewItem(context, sectionItem) {
            // Set item type
            sectionItem.setType(Zotero.ItemTypes.getID('bookSection'));

            // Change authors to book authors
            var creators = sectionItem.getCreators();
            for (var index = 0; index < creators.length; index++) {
                if (creators[index].creatorTypeID ==
                        Zotero.CreatorTypes.getID('author')) {
                    creators[index] = Zotero.CreatorTypes.getID('bookAuthors');
                }
            }

            // Relate items
            bookItem.addRelatedItem(sectionItem);
            sectionItem.addRelatedItem(bookItem);

            Zotero.Promise.coroutine(function*() {
                yield sectionItem.saveTx()
                yield bookItem.saveTx()

                // Update GUI and select textbox
                context.editItemInfoGUI()
            })()
        }

        // Duplicate item and then do the work
        Zotero.Promise.coroutine(function*(context) {
            let sectionItem = yield ZoteroPane.duplicateSelectedItem()
            modifyNewItem(context, sectionItem)
        })(this)

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
            prompts.alert(
                null,
                Zutilo.getString('zutilo.error.booksectiontitle'),
                Zutilo.getString('zutilo.error.booksectionmessage')
            )
            return false;
        }

        function modifyNewItem(context, bookItem) {
            bookItem.setType(Zotero.ItemTypes.getID('book'));

            // Change book title to title
            var bookTitleField = Zotero.ItemFields.getID('bookTitle');
            var titleField = Zotero.ItemFields.getID('title');
            var bookTitle = sectionItem.getField(bookTitleField);
            if (bookTitle !== '') {
                bookItem.setField(titleField, bookTitle);
            }
            bookItem.setField(Zotero.ItemFields.getID('abstractNote'), '')

            // Relate items
            bookItem.addRelatedItem(sectionItem)
            sectionItem.addRelatedItem(bookItem)

            Zotero.Promise.coroutine(function*() {
                yield sectionItem.saveTx()
                yield bookItem.saveTx()

                // Update GUI and select textbox
                context.editItemInfoGUI()
            })()
        }

        // Duplicate item and then do the work
        Zotero.Promise.coroutine(function*(context) {
            let bookItem = yield ZoteroPane.duplicateSelectedItem()
            modifyNewItem(context, bookItem)
        })(this)


        return true;
    },

    /******************************************/
    // XUL overlay functions
    /******************************************/
    fullOverlay: function() {
        // Add all Zutilo overlay elements to the window
        ZutiloChrome.zoteroOverlay.overlayZoteroPane(document)
        this.initKeys();

        var toolsPopup = document.getElementById('menu_ToolsPopup')
        toolsPopup.addEventListener('popupshowing',
            ZutiloChrome.zoteroOverlay.prefsSeparatorListener, false)
    },

    overlayZoteroPane: function(doc) {
        var menuPopup
        menuPopup = doc.getElementById('menu_ToolsPopup')
        ZutiloChrome.zoteroOverlay.prefsMenuItem(doc, menuPopup)
        ZutiloChrome.zoteroOverlay.zoteroPopup('item', doc)
        ZutiloChrome.zoteroOverlay.zoteroPopup('collection', doc)
    },

    prefsSeparatorListener: function() {
        var addonsMenuItem = document.getElementById('menu_addons')
        var nextSibling = addonsMenuItem
        var needSeparator = true
        while (nextSibling) {
            if (nextSibling.nodeName == 'menuseparator') {
                needSeparator = false
                break
            }
            nextSibling = nextSibling.nextSibling
        }
        if (needSeparator) {
            var zutiloSeparator = document.createElement('menuseparator')
            zutiloSeparator.setAttribute('id', 'zutilo-toolsmenu-separator')
            var toolsPopup = document.getElementById('menu_ToolsPopup')
            toolsPopup.insertBefore(zutiloSeparator,
                addonsMenuItem.nextSibling)
            var removeListener = function() {
                toolsPopup.removeChild(zutiloSeparator)
                toolsPopup.removeEventListener('popuphiding',
                    removeListener, false)
            }
            toolsPopup.addEventListener('popuphiding', removeListener,
                false)
        }
    },

    pageloadListener: function(event) {
        if (event.originalTarget.location == Zutilo.zoteroTabURL) {
            ZutiloChrome.zoteroOverlay.overlayZoteroPane(event.originalTarget);
        }
    },

    prefsMenuItem: function(doc, menuPopup) {
        // Add Zutilo preferences item to Tools menu
        if (menuPopup === null) {
            // Don't do anything if elements not loaded yet
            return;
        }

        var zutiloMenuItem = doc.createElement('menuitem')
        var zutiloMenuItemID = 'zutilo-preferences'
        zutiloMenuItem.setAttribute('id', zutiloMenuItemID)
        zutiloMenuItem.setAttribute(
            'label',
            Zutilo.getString('zutilo.preferences.menuitem')
        )
        zutiloMenuItem.addEventListener('command',
            function() {
                ZutiloChrome.openPreferences()
            }, false)

        menuPopup.appendChild(zutiloMenuItem)

        ZutiloChrome.registerXUL(zutiloMenuItemID, doc)
    },

    /******************************************/
    // Item menu functions
    /******************************************/
    // Create XUL for Zotero menu elements
    zoteroPopup: function(menuName, doc) {
        var zoteroMenu = doc.getElementById(`zotero-${menuName}menu`);
        if (zoteroMenu === null) {
            // Don't do anything if elements not loaded yet
            return;
        }
        let deletions = []
        for (let child of zoteroMenu.children) {
            if (child.id.startsWith("zutilo")) {
                deletions.push(child)
            }
        }
        for (let child of deletions) {
            zoteroMenu.removeChild(child)
        }

        var zutiloSeparator = doc.createElement('menuseparator');
        var zutiloSeparatorID = `zutilo-${menuName}menu-separator`;
        zutiloSeparator.setAttribute('id', zutiloSeparatorID);
        zoteroMenu.appendChild(zutiloSeparator);
        ZutiloChrome.registerXUL(zutiloSeparatorID, doc);

        this.createMenuItems(menuName, zoteroMenu, `zutilo-zotero${menuName}menu-`,
                                 true, doc);

        // Zutilo submenu
        var zutiloSubmenu = doc.createElement('menu');
        var zutiloSubmenuID = `zutilo-${menuName}menu-submenu`;
        zutiloSubmenu.setAttribute('id', zutiloSubmenuID);
        zutiloSubmenu.setAttribute(
            'label',
            Zutilo.getString(`zutilo.${menuName}menu.zutilo`)
        )
        zoteroMenu.appendChild(zutiloSubmenu);
        ZutiloChrome.registerXUL(zutiloSubmenuID, doc);

        // Zutilo submenu popup
        var zutiloSubmenuPopup = doc.createElement('menupopup');
        zutiloSubmenuPopup.setAttribute('id', `zutilo-${menuName}menu-submenupopup`);
        zutiloSubmenu.appendChild(zutiloSubmenuPopup);

        this.createMenuItems(menuName, zutiloSubmenuPopup, `zutilo-zutilo${menuName}menu-`,
                                 false, doc);

        this.refreshZoteroPopup(menuName, doc);
    },

    CheckVisibility: new class {
        copyJSON() {
            return !ZutiloChrome.zoteroOverlay.CopyItems.ready.isPending() && ZutiloChrome.zoteroOverlay.CopyItems.sourceItem()
        }

        pasteJSON() {
            return !ZutiloChrome.zoteroOverlay.CopyItems.ready.isPending() && ZutiloChrome.zoteroOverlay.CopyItems.targetItems().length && ZutiloChrome.zoteroOverlay.CopyItems.clipboard()
        }

        pasteJSONIntoEmptyFields() {
            return this.pasteJSON()
        }

        pasteJSONFromNonEmptyFields() {
            return this.pasteJSON()
        }

        pasteJSONAll() {
            return this.pasteJSON()
        }

        copyZoteroCollectionSelectLink() {
            return ZutiloChrome.zoteroOverlay.Collection.selected()
        }

        copyZoteroCollectionURI() {
            return (typeof Zotero.Users.getCurrentUserID() !== 'undefined') && ZutiloChrome.zoteroOverlay.Collection.selected()
        }
    },

    // Update hidden state of Zotero item menu elements
    refreshZoteroPopup: function(menuName, doc) {
        if (typeof doc == 'undefined') {
            doc = document;
        }
        var showMenuSeparator = false;
        var showSubmenu = false;

        for (const functionName of Zutilo._menuFunctions[menuName]) {
            var prefVal = Zutilo.Prefs.get(`${menuName}menu.${functionName}`);

            var zutiloMenuItem = doc.getElementById(`zutilo-zutilo${menuName}menu-${functionName}`);
            var zoteroMenuItem = doc.getElementById(`zutilo-zotero${menuName}menu-${functionName}`);

            const visible = !this.CheckVisibility[functionName] || this.CheckVisibility[functionName]()

            if (visible && prefVal == 'Zotero') {
                showMenuSeparator = true;
                zutiloMenuItem.hidden = true;
                zoteroMenuItem.hidden = false;
            } else if (visible && prefVal == 'Zutilo') {
                showMenuSeparator = true;
                showSubmenu = true;
                zutiloMenuItem.hidden = false;
                zoteroMenuItem.hidden = true;
            } else {
                zutiloMenuItem.hidden = true;
                zoteroMenuItem.hidden = true;
            }
        }

        doc.getElementById(`zutilo-${menuName}menu-separator`).hidden = !showMenuSeparator;
        doc.getElementById(`zutilo-${menuName}menu-submenu`).hidden = !showSubmenu;
    },

    // Create Zotero item menu items as children of menuPopup
    createMenuItems: function(menuName, menuPopup, IDPrefix, elementsAreRoot, doc) {
        var menuFunc;
        for (const functionName of Zutilo._menuFunctions[menuName]) {
            debug(functionName)
            menuFunc = this.zoteroMenuItem(menuName, functionName, IDPrefix, doc);
            menuPopup.appendChild(menuFunc);
            if (elementsAreRoot) {
                ZutiloChrome.registerXUL(menuFunc.id, doc);
            }
        }
    },

    // Create Zotero item menu item
    zoteroMenuItem: function(menuName, functionName, IDPrefix, doc) {
        var menuFunc = doc.createElement('menuitem');
        menuFunc.setAttribute('id', IDPrefix + functionName);
        menuFunc.setAttribute(
            'label',
            Zutilo.getString(`zutilo.${menuName}menu.${functionName}`)
        )
        let match = functionName.match(/(.*_alt)(\d+)$/)
        if (match === null) {
            menuFunc.addEventListener('command',
                function(event) {
                    event.stopPropagation()
                    ZutiloChrome.zoteroOverlay[functionName]()
                }, false)
        } else {
            let base = match[1]
            let num = match[2]
            menuFunc.addEventListener('command',
                function(event) {
                    event.stopPropagation()
                    ZutiloChrome.zoteroOverlay[base](num)
                }, false)
        }
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
            this.createKey(keyLabel)
        }
    },

    reloadKeys: function() {
        for (let key of this.keyset.children) {
            this.keyset.removeChild(key)
        }
        for (var keyLabel in Zutilo.keys.shortcuts) {
            this.createKey(keyLabel)
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
        if (key === null) {
            // updateKey gets triggered before keys have been set when Zutilo
            // is reinstalled if shortcuts had been set during the previous
            // install previously defined
            return
        }

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
    getSelectedAttachments: function(mode) {

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

        if (mode !== undefined) {
            attachmentItems = attachmentItems.filter(
                (item) => item.attachmentLinkMode == mode
            )
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

        var errorTitle = Zutilo.getString('zutilo.checkItems.errorTitle')
        switch (checkType) {
            case 'regular1':
            case 'regularOrNote1':
            case 'regularNoteAttachment1':
                if (!itemArray.length) {
                    prompts.alert(
                        null,
                        errorTitle,
                        Zutilo.getString('zutilo.checkItems.' + checkType)
                    )
                    checkBool = false;
                }
                break;
            case 'regularSingle':
                if ((!itemArray.length) || (itemArray.length > 1)) {
                    prompts.alert(
                        null,
                        errorTitle,
                        Zutilo.getString('zutilo.checkItems.regularSingle')
                    )
                    checkBool = false;
                }
                break;
            case 'regular2':
            case 'regularOrNote2':
            case 'regularNoteAttachment2':
                if ((!itemArray.length) || (itemArray.length < 2)) {
                    prompts.alert(
                        null,
                        errorTitle,
                        Zutilo.getString('zutilo.checkItems.' + checkType)
                    )
                    checkBool = false;
                }
                break;
            case 'attachment1':
                if (!itemArray.length) {
                    prompts.alert(
                        null,
                        errorTitle,
                        Zutilo.getString('zutilo.checkItems.attachment1')
                    )
                    checkBool = false;
                }
                break;
        }

        return checkBool;
    }
};

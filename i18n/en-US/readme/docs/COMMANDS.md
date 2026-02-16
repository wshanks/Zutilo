### Item menu functions
Each of the functions below can be called from the Zotero item context menu (accessed by right-clicking in the items pane in the middle of Zotero where all of a collection's items are listed).
In the Zutilo preferences (accessed from Zotero "Tools" menu), each of these functions can be set to show up in the Zotero item menu, in a Zutilo submenu of the Zotero item menu, or not to appear at all.

* __Copy tags:__
    Right click items in the Zotero library and copy their tags to the clipboard as a '\r\n' delimited list.
    Such a list of tags can be pasted into a new tag box to add all of the tags to an item at once.

* __Remove tags:__
    Right click items in the Zotero library and remove all of their tags.

* __Paste tags:__
    Right click items in the Zotero library and paste the contents of the clipboard to them.
    The contents of the clipboard must be a '\r\n' or '\n' delimited list (such as the list created by the copy tags function described above).

* __Copy creators:__
    Right click items in the Zotero library and copy their creators to the clipboard as a '\r\n' delimited list.

* __View attachment paths:__
    Display the paths to selected attachment items and to attachments of selected regular items (one by one as separate dialog windows -- you probably don't want to select more than a couple items at a time this way!).

* __Modify attachment paths:__
    Change the beginning of the path to all eligible selected attachments and to all attachments of selected regular items.
    Two prompt windows appear.
    The first asks for the old partial path while the second asks for the new partial path.
    If you enter "C:/userData/references/" for the first path and "E:/" for the second path, then an attachment file with a path of "C:/userData/references/journals/Nature/2008/coolPaper.pdf" will have its path changed to "E:/journals/Nature/2008/coolPaper.pdf" while an attachment with path "E:/journals/Science/2010/neatPaper.pdf" will be left unchanged.
    This function is mainly useful for when you change computers or hard drives and break the links to all of your attachments (though note that Zotero has a relative attachment path feature that should address this issue for attachment collections all stored togehter under one parent directory).

    By default, the old partial path is only compared with the beginning of each attachment path.
    To replace elements of attachment paths not at the beginning, click the "replace all instances" check box in the first prompt window.
    This option is useful if you want to rename a subfolder or switch between Windows and Unix style paths (replacing `\` and `/`).

* __Modify attached URLs:__
    This function works the same as `Modify attachment paths` above but modifies the URL of URL attachments instead of the file path of linked file attachments.

* __Copy attachment paths:__
    Copy to the clipboard the path for each selected attachment and/or each child attachment of each selected item.
    For file attachments, the full path on the file system is copied.
    URL link attachments are ignored.

* __Relate items:__
    Set all selected items to be related to each other.

* __QuickCopy items:__
    Copy selected items to the clipboard using the "Default output format" specified in the "Export" section of Zotero's preferences.
    It is also possible to set alternative quick copy items.
    By default, two such items are enabled, labeled "alt 1" and "alt 2".
    Additional items can be enabled by changing the `extensions.zutilo.copyItems_alt_total` preference in the config editor.
    These items will copy to the clipboard using alternative export translators.
    To select the translators used by these functions, the corresponding preferences `extensions.zutilo.quickcopy_alt1`, `extensions.zutilo.quickcopy_alt2`, etc. must be set in the config editor.
    Each preference should be set to whatever appears in the config editor for the `export.quickCopy.setting` preference when the desired translator is set as the "Default output format" in Zotero's preferences.
        The config editor can be opened from the Advanced pane of Zotero's preferences window.

* __Copy select item links:__
    Copy links of the form "zotero://select/library/items/ITEM_ID" to the clipboard for each selected item.
    Following links from other applications can select items in the Zotero client but might require additional set up.

* __Copy Zotero IDs:__
    Copy the ID of each selected item to the clipboard.

* __Copy Zotero URIs:__
    Copy (www.zotero.org) links to the clipboard for each selected item.
    If you have a (www.zotero.org) profile, following such a link will open the page for the corresponding item in profile on (www.zotero.org).
    If you do not have a (www.zotero.org) profile, a placeholder link is still generated but might not be useful.

* __Open Zotero URIs:__
    Open (www.zotero.org) links for each selected item.
    See description for "Copy Zotero URIs".

* __Create book section:__
    Create a book section item from the currently selected book item.

    The new item is created by duplicating the book item and changing its type to book section.
    Author entries for the book item are converted to "book author" entries for the new book section item.
    The new book section item is added as a related item to the original book item.
    Finally, the title textbox for the new item is focused so that a new title for the book section may be entered.

    This function only works when a single book item is selected.
    Note that some fields (number of pages and short title, as of late 2014) apply only to book items and not book section items.
    There is no prompt to confirm this loss of fields from the created book section item.

* __Create book item:__
    Create a book item from teh currently selected book section item.

    First the book section item is duplicated and converted to a book item.
    Then the item's title is set to the "Book title" of the book section item and its abstract is deleted.
    The new book item is set as a related item of the book section item.
    Finally the title field of the new book item is selected for editing.

* __Copy child items:__
    Copy the child items of a selected item to an internal Zutilo clipboard (not the desktop clipboard).
    This function is meant to be used in conjunction with the "Relocate child items" function.

* __Relocate child items:__
    Move all items stored in Zutilo's internal clipboard (put there by the "Copy child items" function) to the currently selected item.

* __Copy item fields:__
    Copies all source-item metadata fields to the clipboard.
    The data copied is all data visible in the right panel only (not tags, not notes).

* __Paste into empty item fields:__
    (‘Paste-into-empty’) paste where source has value and target has none/empty.
    Authors from the source are merged in even if the target already has authors.

* __Paste non-empty item fields__
    (‘Paste-non-empty’): paste where source has value.
    Replaces authors if there is an author field in the pasted data.

* __Paste all item fields__
    (‘Paste-all’): Paste all item fields from source, even if they are empty.

    To edit specific item fields, select a source item and use "Copy item fields".
    Paste to a text editor, edit the JSON text, then copy the modified text back to the clipboard.
    Finally, select the target items and use "Paste all item fields".
    The `itemType` name/value pair needs to be kept in the JSON text because Zutilo uses its presence to decide whether to use the paste JSON commands in the context menu; its value is irrelevant for this function.
    You can, e.g., clear the URL field in multiple items by pasting `{"itemType": "book", "url": ""}`, which will not change any item types.

* __Paste item type__
    (‘Paste-type’): Paste the item type of the source item to the target items.
    This will not change item field values.
    However, changing the type of a Zotero item modifies the list of its valid fields.
    It's important to realize that data in invalid fields will be lost!

### Collection menu functions
Each of the functions below can be called from the Zotero collection context menu (accessed by right-clicking on a collection in the collections pane at the right of Zotero where all the collections are listed).
In the Zutilo preferences (accessed from Zotero "Tools" menu), each of these functions can be set to show up in the Zotero item menu, in a Zutilo submenu of the Zotero item menu, or not to appear at all.

* __Copy select collection link:__
    Copy links of the form "zotero://select/library/collections/ITEM_ID" to the clipboard for the selected collection.
    Following links from other applications can select the collection in the Zotero client but might require additional set up.

* __Copy Zotero URI:__
    Copy (www.zotero.org) link to the clipboard for the selected collection.
    If you have a (www.zotero.org) profile, following such a link will open the page for the corresponding item in profile on (www.zotero.org).
    If you do not have a (www.zotero.org) profile, a placeholder link is still generated but might not be useful.

### Navigating the UI and editing items via keyboard shortcuts

Zutilo currently implements several keyboard shortcuts that are useful for editing Zotero items.
The following functions work when only a single Zotero item is selected:

* __Edit item info:__
    Select the "Info" tab in the item pane.
    Set the focus to the first editable field of the item's info.

* __Add note:__
    Select the "Notes" tab of the item pane.
    Create a new note.
    Added for completeness, but Zotero already has a keyboard shortcut that does this.
    It can be set in Zotero's preferences.

* __Add tag:__
    Select the "Tags" tab of the item pane.
    Open a textbox for creating a new tag.

* __Add related item:__
    Select the "Related" tab of the item pane.
    Open the dialog for adding related items.

The following four functions are similar to the four item editing functions above, except that they just set focus on the respective tab in the item pane.

* __Focus item pane: Info tab:__
    Select the "Info" tab in the item pane.

* __Focus item pane: Notes tab:__
    Select the "Notes" tab of the item pane.

* __Focus item pane: Tags tab:__
    Select the "Tags" tab of the item pane.

* __Focus item pane: Related tab:__
    Select the "Related" tab of the item pane.

The following two functions allow you to cycle through the same four tabs in the item pane.

* __Focus item pane: next tab:__
    Select next tab in item pane.

* __Focus item pane: previous tab:__
    Select previous tab in item pane.

Zutilo implements several keyboard shortcuts that are useful for navigating between and within the three main panes.
If the relevant pane is hidden, the following functions will show it.

* __Focus collections pane:__
    Set the focus to the collections pane (left pane, Libraries pane).
    Similar to the existing Zotero shortcut, except that this function also shows the pane if it's hidden.

* __Focus items pane:__
    Set the focus to the items pane (middle pane).

The following two functions allow you to easily show or hide the collections pane (left pane) and the item pane (right pane).

* __Item pane: Show / hide:__
    Show or hide the item pane.

* __Collections pane: Show / hide:__
    Show or hide the collections pane.

Like the functions above, the following two functions allow you to easily show or hide the collections pane (left pane) and the item pane (right pane).
However, when the pane is shown, the thicker vertical divider ("splitter", "grippy", appears when the pane is hidden) remains visible until the width of the pane is adjusted. 

* __Item pane: Show / hide (sticky):__
    Show or hide the item pane.
    When the pane is show, the thicker vertical divider remains visible until the width of the pane is adjusted.

* __Collections pane: Show / hide (sticky):__
    Show or hide the collections pane.
    When the pane is show, the thicker vertical divider remains visible until the width of the pane is adjusted.

### Attachment functions

* __Attach link to file:__
    Open a file picker dialog for selecting a file to attach to the currently selected item as a linked file attachment.

* __Attach uri:__
    Open a textbox dialog for adding a URI attachment to the current item.

* __Attach stored copy:__
    Open a file picker dialog for selecting a file to attach to the currently selected item as a stored attachment.

* __Create parent item:__
    Create a parent item for the currently selected attachment item that does not have a parent.

* __Find available PDFs:__
    Find available PDFs for selected items.

* __Rename attachments:__
    Use the parent item's metadata to rename its attachments.

* __Retrieve metadata for pdf:__
    Try to look up the metadata for the selected stored pdf attachment.

### Miscellaneous functions

* __Duplicate item:__
    Create a duplicate of the selected item

* __Generate report:__
    Generate Zotero report from selected items or collection.
    If the Collections pane has focus, a report is generated for the selected collection.
    Otherwise, a report is generated for the currently selected items.

* __Open New Item menu:__
    Open the new item menu so that the type of new item to create can be selected from it.

* __Open Run JavaScript window:__
    Open the Run JavaScript window, which is also accessible through Zotero's "Tools" menu, by selecting "Developer" -> "Run JavaScript".

* __Open style editor:__
    Open the style editor window (normally accessible from the "Cite" tab of Zotero's preferences).

* __Locate item:__
    Equivalent to using one of the Lookup engines from the Locate menu accessed from the top of the item pane.
    The default engine is "Google Scholar Search".
    To change the engine, modify the `extensions.zutilo.locateItemEngine` preference in the config editor.
    The config editor can be opened from the Advanced pane of Zotero's preferences window.
    For a list of valid engine names, select "Developer->Run JavaScript" from Zotero's "Tools" menu and enter and run this command: `Zotero.LocateManager.getVisibleEngines().map(engine => engine.name)`.

### Better BibTeX functions

The following functions are only available when [Better BibTeX](https://github.com/retorquere/zotero-better-bibtex) is installed.

* __Pin key:__ Pin the key for the currently selected items.

* __Unpin key:__ Unpin the key for the currently selected items.

* __Force-refresh key:__ Force-refresh the key for the currently selected items.

* __Push to TeXstudio:__ Push references to TeXstudio.

### ZotFile functions

The following functions are only available when [ZotFile](zotfile.com) is installed.

* __Attach new file:__ Attach the newest file in the ZotFile source directory to the currently selected item.

* __Move and rename attachments:__ Move and rename the files associated with the currently selected attachments to following the format configured in ZotFile's preferences.

* __Extract annotations:__ Trigger ZotFile's "Extract Annotations" function.

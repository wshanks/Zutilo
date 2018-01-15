### Item menu functions
Each of the functions below can be called from the Zotero item menu (accessed by right-clicking in the items pane in the middle of Zotero where all of a collection's items are listed).
In the Zutilo preferences (accessed from the same menu as Zotero's preferences), each of these functions can be set to show up in the Zotero item menu, in a Zutilo submenu of the Zotero item menu, or not to appear at all.

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
	There are also two alternative QuickCopy items (labeled "alt 1" and "alt 2").
	These items will copy to the clipboard using alternative export translators.
	To select the translators used by these functions, the corresponding preferences `extensions.zutilo.quickcopy_alt1` and `extensions.zutilo.quickcopy_alt2` must be set in `about:config`.
	Each preference should be set to whatever appears in `about:config` for the `export.quickCopy.setting` preference when the desired translator is set as the "Default output format" in Zotero's preferences.

* __Copy select item links:__
	Copy links of the form "zotero://select/items/ITEM_ID" to the clipboard for each selected item.
	Pasting such a link into the Firefox address bar will select the corresponding item in the Zotero Firefox plugin.
	Following links from other applications and having the links select items in the Zotero Standalone client may also be achievable but might require additional set up.

* __Copy Zotero URIs:__
	Copy (www.zotero.org) links to the clipboard for each selected item.
	If you have a (www.zotero.org) profile, following such a link will open the page for the corresponding item in profile on (www.zotero.org).
	If you do not have a (www.zotero.org) profile, a placeholder link is still generated but might not be useful.

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

The following two functions allow you to cycle through the same four tags in the item pane.

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

* __Rename attachments:__
    Use the parent item's metadata to rename its attachments.

* __Retrieve metadata for pdf:__
    Try to look up the metadata for the selected stored pdf attachment in Google Scholar.

### Miscellaneous functions

* __Duplicate item:__
    Create a duplicate of the selected item

* __Generate report:__
    Generate Zotero report from selected items or collection.
    If the Collections pane has focus, a report is generated for the selected collection.
    Otherwise, a report is generated for the currently selected items.

* __Open New Item menu:__
    Open the new item menu so that the type of new item to create can be selected from it.

* __Open style editor:__
    Open the style editor window (normally accessible from the advanced section of Zotero's preferences).

### Firefox browser shortcut functions

The following shortcut functions are only available in the Zotero Firefox addon.

* __Focus Zotero:__
    Make Zotero visible if it is not.
    Focus Zotero so that, e.g., `Tab` and the arrow keys work on the Zotero UI rather than the previously focused element of Firefox's UI.

* __Hide Zotero:__
    Hide Zotero if it was visible.

* __Toggle Zotero:__
    Show Zotero if it was not visible.
    Otherwise hide Zotero.

* __Save webpage as a Zotero item:__
    Save the current page as a webpage item in Zotero.

* __Save item:__
    Add an item to the Zotero library based on the reference content of the current webpage (equivalent to clicking on the little page/book icon in the Firefox address bar).
    In Zotero, the function that creates the item from the web page content is referred to as a `translator`.

* __Save item without attachments:__
    Create an item in a similar manner to "Save item" but __do not__ save attachment files for the item regardless of whether or not Zotero is set to save such attachments in its preferences.

* __Save item with attachments:__
    Create an item in a similar manner to "Save item" but __do__ save attachment files for the item regardless of whether or not Zotero is set to save such attachments in its preferences.

* __Save item (reverse attachment pref):__
    Create an item in a similar manner to "Save item" but only save attachments if Zotero is set not to save attachments in its preferences.

* __Attach current page:__
    Attach the current browser page to the selected Zotero item.
    This function works best when the current web page is a PDF opened with Firefox's internal PDF viewer.

### Firefox browser menu functions

These functions add items to the Zotero "Save item" button's menu and to the Firefox right-click menu.
Any of the menu items can be set to hidden in Zutilo's preferences.

* __Attaching webpages and links to Zotero items:__
    Zutilo adds context menu items to Firefox for attaching the current page or the current link target (if a link is selected in the current web page) to the item currently selected in Zotero.
    Attaching the current web page is also available as a keyboard shortcut.

    How the attachment is processed depends on the attachment method set in Zutilo's preferences.
    If the method is 'Import', an imported attachment is created from the page/link.
    If the method is 'Prompt for linked file', a file prompt appears to allow the user to specify a new file.
    The page/link is saved to this file and then a linked file attachment (linked to the downloaded file) is created.
    If the method is 'Prompt after first', an imported attachment is created if the selected item has no previous attachments (not counting webpage snapshot attachments).
    Otherwise, the file prompt for creating a linked file attachment is shown.
    If the shift key is pressed when the attachment function is activated, a prompt for a linked file is shown regardless of Zutilo's preference setting.
    If the control key is pressed, the attachment is imported regardless of Zutilo's preference setting.

* __Save item from a current webpage with or without attachments:__
    Zutilo adds extra menu items to the context menu of Zotero's "Save item" button that save an item for the current page with or without extracting the page's associated PDF's and other files.
    That is, if the "Automatically attach PDFs and other files" preference is selected in Zotero, Zutilo adds menu items for saving the item without attachments.
    One menu item is created for each "Save to Zotero" method that applies to the current page.
    If the preference is not selected, Zutilo adds menu items for saving an item with the attachments.

    This function works by toggling the associated files preference in Zotero, creating the item, and then toggling the preference back to its original state.
    Because Zotero translates pages asynchronously (and thus simultaneously), translations made with this function should be allowed to finish before starting normal page translations with Zotero (since otherwise the state of the "Associated files" preference will depend on the timing of the simultaneous translations).

### Better BibTeX functions

The following functions are only available when [Better BibTeX](https://github.com/retorquere/zotero-better-bibtex) is installed (and only for Zotero version 5.0 or higher).

* __Pin key:__ Pin the key for the currently selected items.

* __Unpin key:__ Unpin the key for the currently selected items.

* __Force-refresh key:__ Force-refresh the key for the currently selected items.

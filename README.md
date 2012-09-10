Zutilo
======

Zutilo is a small Firefox extension that serves as a plugin for the Zotero Firefox extension.  Zutilo was designed as a utility to provide several small functionalities that are not present in Zotero.  Its name was chosen by taking the word "utility" and making it sound more like "Zotero."

Current feature list
--------------------

### Item menu functions ###
Each of the functions below can be called from the Zotero item menu (accessed by right-clicking in the items pane in the middle of Zotero where all of a collection's items are listed).  In the Zutilo preferences (accessed from the same menu as Zotero's preferences), each of these functions can be set to show up in the Zotero item menu, in a Zutilo submenu of the Zotero item menu, or not to appear at all.

* __Copy tags:__
Right click items in the Zotero library and copy their tags to the clipboard as a '\r\n' delimited list.  (Function name: "copyTags").

* __Paste tags:__
Right click items in the Zotero library and paste the contents of the clipboard to them.  The contents of the clipboard must be a '\r\n' or '\n' delimited list (such as the list created by the copy tags function described above).  (Function name: "pasteTags").

* __Copy creators:__
Right click items in the Zotero library and copy their creators to the clipboard as a '\r\n' delimited list.  (Function name: "copyCreators").

* __View attachment paths:__
Display the paths to selected attachment items and to attachments of selected regular items (one by one as separate dialog windows -- you probably don't want to select more than a couple items at a time this way!).  (Function name: "showAttachments").

* __Modify attachment paths:__
Change the beginning of the path to all eligible selected attachments and to all attachments of selected regular items.  Two prompt windows appear.  The first asks for the old partial path while the second asks for the new partial path.  If you enter "C:/userData/references/" for the first path and "E:/" for the second path, then an attachment file with a path of "C:/userData/references/journals/Nature/2008/coolPaper.pdf" will have its path changed to "E:/journals/Nature/2008/coolPaper.pdf" while an attachment with path "E:/journals/Science/2010/neatPaper.pdf" will be left unchanged. This function is mainly useful for when you change computers or hard drives and break the links to all of your attachments.  (Function name: "modifyAttachments").

* __Relate items:__
Set all selected items to be related to each other.  (Function name: "relateItems").

### Item editing functions ###

Zutilo currently implements several functions that are useful for working with the keyboard.  These functions can not be called from any graphical element.  They were created to be called by another plugin such as Keyconfig, which can assign a keyboard shortcut to any function.  To use them, assign a keyboard shortcut to Zotero.Zutilo.functionName() where "functionName" is replaced by one of the function names below (You can also use the function names of the functions described in the "Item menu functions" section above which are given in parentheses at the end of each function description).  The following functions work when only a single Zotero item is selected:

* __editItemInfoGUI:__
	Select the "Info" tab in the item pane.  Set the focus to the first editable field of the item's info.
* __addNoteGUI:__
	Select the "Notes" tab of the item pane.  Create a new note.  Added for completeness, but Zotero already has a keyboard shortcut that does this.  It can be set in Zotero's preferences.
* __addTagGUI:__
	Select the "Tags" tab of the item pane.  Open a textbox for creating a new tag.
* __addRelatedGUI:__
	Select the "Related" tab of the item pane.  Open the dialog for adding related items.
	
For reference, here are a few other functions in Zotero that I have found it useful to map keyboard shortcuts for.  For these functions, you don't need any prefix (like "Zotero.Zutilo." above):

* __ZoteroOverlay.toggleDisplay():__
	Shows/hides the Zotero pane in Firefox.
* __ZoteroPane.addItemFromPage():__
	Save the current page as a webpage item in Zotero.
* __Zotero_Browser.scrapeThisPage():__
	Adds an item to the Zotero library from the current webpage (equivalent to clicking on the little page/book icon in the Firefox address bar).

How to install
--------------

If you have the zutilo.xpi file, go to Tools->Add-ons in Firefox and then click on the gear button and choose "Install Add-on From File." Then select the .xpi file.  (If you haven't downloaded anything yet, just download the .xpi file).

If you have the unzipped set of files (install.rdf, the chrome folder, etc.), you can zip them all, change the .zip extension to a .xpi extension and follow the directions above, or create a text file named zutilo@wesailatdawn.com, put the directory path to Zutilo's chrome folder as its only line of text, and save the file in the extensions folder of your Firefox profile folder.

Credits
-------

I started out by modifying the Zotero HelloWorld plugin.  I think everything else I got by looking through copying the Zotero source code or the examples in the Mozilla Developer Network documentation.
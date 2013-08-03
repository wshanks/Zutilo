Zutilo
======

Zutilo is a small Firefox extension that serves as a plugin for the [Zotero Firefox extension](http://www.zotero.org/).  Zutilo was designed as a utility to provide several small functionalities that are not present in Zotero.  Its name was chosen by taking the word "utility" and making it sound more like "Zotero." All of Zutilo's graphical elements can be disabled individually, so that unwanted features do not clutter the user interface.

Current feature list
--------------------

### Keyboard shortcuts ###
Most of Zutilo's features can be accessed through context menus that appear when right-clicking on relevant elements in Zotero or Firefox.  It can be useful to call many of Zutilo's functions directly from the keyboard rather than using context menus.  Shortcuts for many of Zutilo's functions (and some base Zotero functions) can be set in the Zutilo preferences window (accessible from the Add-ons Manager or the Zotero actions menu (the "gear" icon).

If you prefer, you may also use the [Customizable Shortcuts](https://addons.mozilla.org/en-US/firefox/addon/customizable-shortcuts/) extension to set Zutilo's shortcuts.  Settings made with this extension will override any settings made in Zutilo's preference window.  Setting Zutilo's shortcuts with the [Keyconfig extension](http://forums.mozillazine.org/viewtopic.php?t=72994) is not recommended (the settings will work for one session but will be overwritten by Zutilo when Firefox is restarted).

Zutilo's functions can be mapped to keyboard shortcuts by using another Firefox plugin such as [Keyconfig](http://forums.mozillazine.org/viewtopic.php?t=72994), which provides a simple interface for mapping keyboard shortcuts to Javascript commands and works with both Firefox and Zotero Standalone, or [Pentadactyl](http://5digits.org/pentadactyl/index) or [Vimperator](http://www.vimperator.org/vimperator), which both provide a more advanced command line interface for Firefox (Pentadactyl users might be interested in [Zoterodactyl](https://github.com/willsALMANJ/Zoterodactyl), a set of Pentadactyl plugins providing key mappings for Zotero and Zutilo).  In the descriptions of features below, the corresponding function names are given.  These are the  Javascript function names that should be mapped to call these functions.

### Item menu functions ###
Each of the functions below can be called from the Zotero item menu (accessed by right-clicking in the items pane in the middle of Zotero where all of a collection's items are listed).  In the Zutilo preferences (accessed from the same menu as Zotero's preferences), each of these functions can be set to show up in the Zotero item menu, in a Zutilo submenu of the Zotero item menu, or not to appear at all.

* __Copy tags:__
Right click items in the Zotero library and copy their tags to the clipboard as a '\r\n' delimited list.  As of Zotero 4.0, such a list of tags can be pasted into a new tag box to add all of the tags to an item at once.  (Function name: `ZutiloChrome.zoteroOverlay.copyTags()`).

* __Paste tags:__
Right click items in the Zotero library and paste the contents of the clipboard to them.  The contents of the clipboard must be a '\r\n' or '\n' delimited list (such as the list created by the copy tags function described above).  (Function name: `ZutiloChrome.zoteroOverlay.pasteTags()`).

* __Copy creators:__
Right click items in the Zotero library and copy their creators to the clipboard as a '\r\n' delimited list.  (Function name: `ZutiloChrome.zoteroOverlay.copyCreators()`).

* __View attachment paths:__
Display the paths to selected attachment items and to attachments of selected regular items (one by one as separate dialog windows -- you probably don't want to select more than a couple items at a time this way!).  (Function name: `ZutiloChrome.zoteroOverlay.showAttachments()`).

* __Modify attachment paths:__
Change the beginning of the path to all eligible selected attachments and to all attachments of selected regular items.  Two prompt windows appear.  The first asks for the old partial path while the second asks for the new partial path.  If you enter "C:/userData/references/" for the first path and "E:/" for the second path, then an attachment file with a path of "C:/userData/references/journals/Nature/2008/coolPaper.pdf" will have its path changed to "E:/journals/Nature/2008/coolPaper.pdf" while an attachment with path "E:/journals/Science/2010/neatPaper.pdf" will be left unchanged. This function is mainly useful for when you change computers or hard drives and break the links to all of your attachments.  

	By default, the old partial path is only compared with the beginning of each attachment path.  Two replace eleemnts of attachment paths not at the beginning, click the "replace all instances" check box in the first prompt window.  This option is useful if you want to rename a subfolder or switch between Windows and Unix style paths (replacing "\" and "/").  (Function name: `ZutiloChrome.zoteroOverlay.modifyAttachments()`).

* __Relate items:__
Set all selected items to be related to each other.  (Function name: `ZutiloChrome.zoteroOverlay.relateItems()`).

### Item editing functions ###

Zutilo currently implements several functions that are useful for editing Zotero items with the keyboard.  These functions can not be called from any graphical element (but can be assigned to a keyboard shortcut as described above).  The following functions work when only a single Zotero item is selected:

* __Edit item info:__
	Select the "Info" tab in the item pane.  Set the focus to the first editable field of the item's info.  (Function name: `ZutiloChrome.zoteroOverlay.editItemInfoGUI()`).
* __Add note:__
	Select the "Notes" tab of the item pane.  Create a new note.  Added for completeness, but Zotero already has a keyboard shortcut that does this.  It can be set in Zotero's preferences.  (Function name: `ZutiloChrome.zoteroOverlay.addNoteGUI()`).
* __Add tag:__
	Select the "Tags" tab of the item pane.  Open a textbox for creating a new tag.  (Function name: `ZutiloChrome.zoteroOverlay.addTagGUI()`).
* __Add related item:__
	Select the "Related" tab of the item pane.  Open the dialog for adding related items.  (Function name: `ZutiloChrome.zoteroOverlay.addRelatedGUI()`).

### Firefox browser functions ###

Zutilo adds a few functions to help with attaching documents to Zotero items from pages in Firefox.  These features are accessed from the Firefox browser and do not work with Zotero Standalone.

* __Attaching webpages and links to Zotero items:__
	Zutilo adds context menu items to Firefox for attaching the current page or the current link target (if a link is selected) to the currently selected Zotero item.  How the attachment is processed depends on the attachment method set in Zutilo's preferences.  If the method is 'Import', an imported attachment is created from the page/link.  If the method is 'Prompt for linked file', a file prompt appears to allow the user to specify a new file.  The page/link is saved to this file and then a linked file attachment (linked to the downloaded file) is created.  If the method is 'Prompt after first', an imported attachment is created if the selected item has no previous attachments (not counting webpage snapshot attachments).  Otherwise, the file prompt for creating a linked file attachment is shown.  If the shift key is pressed when the attachment function is activated, a prompt for a linked file is shown regardless of Zutilo's preference setting.  If the control key is pressed, the attachment is imported regardless of Zutilo's preference setting.
	
	If you want to create a keyboard shortcut to attach the current page to the current Zotero item using the method set in Zutilo's preferences, use `ZutiloChrome.firefoxOverlay.attachURLToCurrentItem(window.content.location.href)` for the command.  The general function call is `ZutiloChrome.firefoxOverlay.attachURLToCurrentItem(url, processType)` where `url` is a string with the URL to be downloaded and processType can be 'Zotero', 'prompt', or 'promptAfterOne'.  If processType is not specified or is set to anything else, the attachment method set in Zutilo's preferences is used.

* __Extract Zotero item from a current webpage with/without attachments:__
	Zutilo adds extra menu items to the context menu of Zotero's status bar icon that extract citations from the current page with or without extracting the page's associated PDF's and other files.  That is, if the "Automatically attach PDFs and other files" preference is selected in Zotero, Zutilo adds menu items (one item for each "Save to Zotero" method that applies to the current page) for creating a new Zotero item without the attachments.  If the preference is not selected, Zutilo adds menu items for creating a new Zotero item with the attachments.
	
	This function works by toggling the associated files preference in Zotero, creating the item, and then toggling the preference back to its original state.  Because Zotero translates pages asynchronously (and thus simultaneously), translations made with this function should be allowed to finish before starting normal page translations with Zotero (since otherwise the state of the "Associated files" preference will depend on the timing of the simultaneous translations).
	
	The function that this feature is based on is `ZutiloChrome.firefoxOverlay.scrapeThisPage(translator, filesBool)`.  If translator (a Zotero translator object) is set to false or not set, the default translator for the page is used.  If fileBool is true, the item is created with the associated attachment files.  If it is false, the item is created without the associated files.  If filesBool is not specified, then the opposite of Zotero's default behavior is used.  So, if in Zotero's preferences the "Automatically attach PDFs and other files" option is selected, `ZutiloChrome.firefoxOverlay.scrapeThisPage(false)` will create an item using the default page translator without attaching any files.

### Base Zotero functions ###

For reference, here are a few other functions in Zotero that I have found it useful to map keyboard shortcuts for:

* __Toggle Zotero:__
	Shows/hides the Zotero pane in Firefox.  (Function name: `ZoteroOverlay.toggleDisplay()`).
* __Save webpage as a Zotero item:__
	Save the current page as a webpage item in Zotero.  (Function name: `ZoteroPane.addItemFromPage()`).
* __Extract Zotero item from a webpage:__
	Adds an item to the Zotero library based on the reference content of the current webpage (equivalent to clicking on the little page/book icon in the Firefox address bar).  (Function name: `Zotero_Browser.scrapeThisPage()`).
	
### A note about attachments ###

Zutilo provides a few functions that give greater control over the management of attachments in Zotero.  Here some possible usages of Zotero attachments are reviewed in order to point out a few possible usages of Zutilo.

Zotero provides a metadata rich interface for organizing and exporting references.  It can also be used as an enhanced file browser by attaching files to Zotero items.  Those items can then be retrieved by searching the Zotero database's fields (e.g. author, title, tags, publication, year, etc.) in a more fine-grained way than a simple file system search.

Zotero supports two kinds of attachments, imported files and linked files.  Imported file attachments are stored within Zotero's storage directory with each attachment stored in a separate folder named with a random string of letters and numbers.  Linked file attachments save only the link to an attachment file's location on the file system (so these attachments can be saved in a file hierarchy more amenable to browsing outside of Zotero).

Base Zotero provides greater support for imported file attachments than for linked file attachments.  With base Zotero, when a new item is created by extracting reference information from a webpage, Zotero can download the PDF (or other) files associated with the reference from the webpage as imported file attachments automatically.  It can also sync imported attachments to the Zotero Server.

The [ZotFile extension](http://www.columbia.edu/~jpl2136/zotfile.html) provides extra support for linked file attachments in Zotero.  ZotFile can be set to automatically convert new imported file attachments to linked file attachments and rename and move the attachment files to a file location based on the attachment parent's metadata.  This feature makes maintaining a directory of linked file attachments as easy as using Zotero's imported attachments.  ZotFile can also batch rename and move existing attachment files (linked or imported) and attach the most recently modified files in the Firefox download folder to Zotero items as moved and renamed linked file attachments.  (ZotFile also has features for extracting PDF annotations as Zotero note items and for syncing attachment files to tablet devices.)

With ZotFile, it is easy to create and maintain a library of linked file attachments.  However, these files will not be synced by Zotero to the Zotero Server.  As of version 4.0, Zotero supports relative paths for linked file attachments.  With linked file attachments saved as relative paths, a user's Zotero library can be sync'ed across multiple machines and all of the linked file links will continue to work as long as the base directory containing all of the linked file attachments is copied to each machine (alternatively, the attachment files could be stored on a network drive that each machine points to as its base directory).

Zutilo's modify attachment paths function can help with working with linked file attachments by batch modifying part of the paths of all selected attachments.  So if a group of attachment files is moved to a new folder, the Zutilo modify attachments function can be used to update all of the linked attachment paths at once.  This function can also be used to change "/" to "\" in attachment paths when changing operating systems.  The relative paths feature of Zotero 4.0 replaces the need for this function, though modifying paths can still be useful for attachment paths that can not be made relative for whatever reason.  Zutilo's show attachment paths function is also useful for debugging the attachment paths currently stored in Zotero, especially for broken paths, so that the paths can be modified with the modify attachment paths function rather than being relinked individually.

Zutilo's page and link attaching functions are useful for attaching files to Zotero items which were missed when the item was originally created or for just attaching extra items later.  Attachments are created following the normal procedure, so these functions can be used to create imported file attachments (default behavior) or linked file attachments if ZotFile is set to automatically rename and move new attachments.  Note that using Zutilo's file prompt option for attaching pages/links will also trigger ZotFile (making it pointless to select a file locaiton via the prompt).  In Zutilo's preferences, the link/page attaching functions can be set to prompt for a file location only when an item already has other attachments.  This preference works well with ZotFile's "only ask if item has other attachments" option, allowing ZotFile to move/rename the first attachment and then prompting for the name/location of subsequent ones.

Sometimes, it is useful to save references to a collection of items for future use, but it is unlikely that the documents themselves will need to be consulted.  In this case, it is best to save the items in Zotero without attaching the associated document files.  Zutilo provides functions for saving items both with and attachments.  Using these functions saves one the trouble of manually changing Zotero's "attach associated PDFs and other files" preference or manually deleting unneeded attachments.
	
### Limitations ###

At the moment, Zutilo works with Zotero as a Firefox browser pane or separate tab and with Zotero Standalone.  (In the past, some functions have not worked with the separate tab and Standalone versions.  If something does not seem to work with one of these modes, try using Zotero as a browser pane in Firefox and see if it works there.  Then please contact me via the [Zutilo's Mozilla Add-ons page](https://addons.mozilla.org/en-US/firefox/addon/zutilo-utility-for-zotero/ "Mozilla Add-ons page") or the [GitHub page](https://github.com/willsALMANJ/Zutilo "GitHub page")).  Some browser-specific features are not available in Zotero Standalone.

One warning: I (and a number of others now) have been using Zutilo for a while now on my own Zotero collection without issue.  If I am alerted to any bugs, I try to fix them as quickly as possible.  That said, please either back up your data or test out Zutilo's functions on a small number of items to make sure it works the way you expect when you use it for the first time!

How to install
--------------

The easiest way to install Zutilo for Zotero as a Firefox extension is via [Zutilo's Mozilla Add-ons page](https://addons.mozilla.org/en-US/firefox/addon/zutilo-utility-for-zotero/ "Zutilo's Mozilla Add-ons page").  Just navigate there in Firefox and click on the "Add to Firefox" button.  For Zotero Standalone, you will have to download the .xpi file and install it manually (see below).

To get the .xpi file, go to [Zutilo's Mozilla Add-ons page](https://addons.mozilla.org/en-US/firefox/addon/zutilo-utility-for-zotero/ "Zutilo's Mozilla Add-ons page").  If you are using Firefox, instead of clicking on the "Add to Firefox" button, right-click on the button and choose "Save Link As...."  You will then get a dialog that lets you save the .xpi file.  If you are using a web browser other than Firefox, the "Add to Firefox" button should instead be a "Download Now" button.  You can click on it to download the .xpi file.

Once you have the zutilo.xpi file, go to Tools->Add-ons in either Firefox or Zotero Standalone.  Click on the gear button in the upper right area of the Add-ons Manager window that appears and choose "Install Add-on From File." Then select the .xpi file.

If you have trouble with the Mozilla Add-ons page, you can also download Zutilo from [Zutilo's GitHub page](https://github.com/willsALMANJ/Zutilo "Zutilo's GitHub page").  Click on the "Download as zip" button there.  Then unzip the downloaded file, zip it back again, and change the file extension from "zip" to "xpi" (I don't know why GitHub's version of the zip file can't be used directly, but unzipping and rezipping seems to work).

If you have trouble getting the .xpi file to work with Firefox, there is one other method you can try.  Save all of the unzipped Zutilo files somewhere on you computer where you want to keep Zutilo.  Create a text file named zutilo@www.wesailatdawn.com, put the directory path to Zutilo's chrome folder as its only line of text, and save the file in the extensions folder of your Firefox profile folder (this method does not seem to work with Zotero Standalone).  This method is useful if you want to use git to pull in updates to Zutilo from GitHub (though if you use Zutilo in Firefox and install it from the Mozilla Add-ons page Firefox should automatically update Zutilo once updates get approved by Mozilla (a little bit after they are posted to GitHub)).  Alternatively, you can rename the Zutilo folder to "zutilo@www.wesailatdawn.com" and move the folder to extensions folder (this method does work with Zotero Standalone).

Feature Requests and Bug Submissions
------------------------------------

The latest source code for Zutilo is maintained on [GitHub](https://github.com/willsALMANJ/Zutilo "Zutilo's GitHub page").  Bugs can be reported by clicking on the "New Issue" button under [the Issues section](https://github.com/willsALMANJ/Zutilo/issues "GitHub Issues page") of the GitHub site.  You can also check there to see if a bug you experience has already been reported by another user.  Make sure to check the "closed" tab of the Issues section to see if the bug has already been addressed.

Feature requests may also be submitted by opening a new issue.  Please open a new issue before submitting your code.  A description of the kinds of features that are appropriate for Zutilo can be found on [the Zutilo wiki page](https://github.com/willsALMANJ/Zutilo/wiki).  A roadmap of planned features is also available on the wiki.

Zutilo is currently uploaded to [BabelZilla](www.babelzilla.org)'s Web Translation System.  When any locales other than English are completed, they will be added to Zutilo.

Log of Important Zutilo Changes
-------------------------------
This section is not a complete log of changes to Zutilo.  It will include any major changes to Zutilo's functionality or added features.  If something breaks on an upgrade of Zutilo, try looking in this section for an explanation.

* In version 1.2.*, keyboard shortcuts were added to Zutilo and a QuickCopy menu item was added.  Also, a bug that prevented Zutilo from loading into Zotero's Firefox tab was fixed.

* In version 1.2.4, fr, es, and de locales were added (please report any translation errors (along with better translations)!).

* In version 1.2.3, functions were added to attach pages and links in Firefox to the currently selected Zotero item and to save the current page to Zotero with attachments if the default setting is to save without attachments (or to save without attachments if the default setting is to save with them).

* As of version 1.2.1, Zutilo can be installed and uninstalled without restarting Firefox.

* As of version 1.1.17, changes made with modifyAttachments should always persist after restarting Firefox.

* As of version 1.1.16, modifyAttachments can now replace elements of the path other than the beginning.

* As of version 1.1.15, modifyAttachments should actually work with Windows paths.

* As of version 1.1.11, the main JavaScript object that Zutilo creates to add functionality to Zotero has been renamed from "Zotero.Zutilo" to "ZutiloChrome.zoteroOverlay".  Any keyboard shortcuts calling methods of this object need to switch names in order to keep working.

Credits
-------

Zutilo is based is modeled on the Firefox extension format suggested in the [XUL School tutorial](https://developer.mozilla.org/en-US/docs/XUL_School).  Additionally, examples were taken from the [Mozilla Developer Network](https://developer.mozilla.org/) documentation and the Zotero source code.  Translation support was provided by Armin Stroß-Radschinski, Goofy, and Urko on BabelZilla.
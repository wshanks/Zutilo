Zutilo
======

Zutilo is a small Firefox extension that serves as a plugin for the [Zotero Firefox extension](http://www.zotero.org/).  Zutilo was designed as a utility to provide several small functionalities that are not present in Zotero.  Its name was chosen by taking the word "utility" and making it sound more like "Zotero."

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
Change the beginning of the path to all eligible selected attachments and to all attachments of selected regular items.  Two prompt windows appear.  The first asks for the old partial path while the second asks for the new partial path.  If you enter "C:/userData/references/" for the first path and "E:/" for the second path, then an attachment file with a path of "C:/userData/references/journals/Nature/2008/coolPaper.pdf" will have its path changed to "E:/journals/Nature/2008/coolPaper.pdf" while an attachment with path "E:/journals/Science/2010/neatPaper.pdf" will be left unchanged. This function is mainly useful for when you change computers or hard drives and break the links to all of your attachments.  

	By default, the old partial path is only compared with the beginning of each attachment path.  Two replace eleemnts of attachment paths not at the beginning, click the "replace all instances" check box in the first prompt window.  This option is useful if you want to rename a subfolder or switch between Windows and Unix style paths (replacing "\" and "/").  (Function name: "modifyAttachments").

* __Relate items:__
Set all selected items to be related to each other.  (Function name: "relateItems").

### Item editing functions and keyboard shortcuts ###

Zutilo currently implements several functions that are useful for working with the keyboard.  These functions can not be called from any graphical element.  They were created to be called by another plugin such as Keyconfig or Pentadactyl, which can assign a keyboard shortcut to any function.  To use them, assign a keyboard shortcut to ZutiloChrome.zoteroOverlay.functionName() where "functionName" is replaced by one of the function names below (You can also use the function names of the functions described in the "Item menu functions" section above which are given in parentheses at the end of each function description).  The following functions work when only a single Zotero item is selected:

* __editItemInfoGUI:__
	Select the "Info" tab in the item pane.  Set the focus to the first editable field of the item's info.
* __addNoteGUI:__
	Select the "Notes" tab of the item pane.  Create a new note.  Added for completeness, but Zotero already has a keyboard shortcut that does this.  It can be set in Zotero's preferences.
* __addTagGUI:__
	Select the "Tags" tab of the item pane.  Open a textbox for creating a new tag.
* __addRelatedGUI:__
	Select the "Related" tab of the item pane.  Open the dialog for adding related items.
	
For reference, here are a few other functions in Zotero that I have found it useful to map keyboard shortcuts for.  For these functions, you don't need any prefix (i.e. they don't need to be prefixed with "ZutiloChrome.zoteroOverlay." like the functions listed above):

* __ZoteroOverlay.toggleDisplay():__
	Shows/hides the Zotero pane in Firefox.
* __ZoteroPane.addItemFromPage():__
	Save the current page as a webpage item in Zotero.
* __Zotero_Browser.scrapeThisPage():__
	Adds an item to the Zotero library from the current webpage (equivalent to clicking on the little page/book icon in the Firefox address bar).
	
### Limitations ###

At the moment, all of Zutilo works with Zotero as a Firefox browser pane or separate tab and with Zotero Standalone.  (In the past, some functions have not worked with the separate tab and Standalone versions.  If something does not seem to work with one of these modes, try using Zotero as a browser pane in Firefox and see if it works there.  Then please contact me via the [Zutilo's Mozilla Add-ons page](https://addons.mozilla.org/en-US/firefox/addon/zutilo-utility-for-zotero/ "Mozilla Add-ons page") or the [GitHub page](https://github.com/willsALMANJ/Zutilo "GitHub page")).

One warning: I (and a number of others now) have been using Zutilo for a while now on my own Zotero collection without issue.  If I am alerted to any bugs, I try to fix them as quickly as possible.  That said, please either back up your data or test out Zutilo's functions on a small number of items to make sure it works the way you expect when you use it for the first time!

How to install
--------------

The easiest way to install Zutilo for Zotero as a Firefox extension is via [Zutilo's Mozilla Add-ons page](https://addons.mozilla.org/en-US/firefox/addon/zutilo-utility-for-zotero/ "Zutilo's Mozilla Add-ons page").  Just navigate there in Firefox and click on the "Add to Firefox" button.  For Zotero Standalone, you will have to download the .xpi file and install it manually (see below).

To get the .xpi file, go to [Zutilo's Mozilla Add-ons page](https://addons.mozilla.org/en-US/firefox/addon/zutilo-utility-for-zotero/ "Zutilo's Mozilla Add-ons page").  If you are using Firefox, instead of clicking on the "Add to Firefox" button, right-click on the button and choose "Save Link As...."  You will then get a dialog that lets you save the .xpi file.  If you are using a web browser other than Firefox, the "Add to Firefox" button should instead be a "Download Now" button.  You can click on it to download the .xpi file.

Once you have the zutilo.xpi file, go to Tools->Add-ons in either Firefox or Zotero Standalone.  Click on the gear button in the upper right area of the Add-ons Manager window that appears and choose "Install Add-on From File." Then select the .xpi file.

If you have trouble with the Mozilla Add-ons page, you can also download Zutilo from [the downloads section of Zutilo's GitHub page](https://github.com/willsALMANJ/Zutilo/downloads "Zutilo's GitHub page").  Click on the "Download as zip" button there.  Then unzip the downloaded file, zip it back again, and change the file extension from "zip" to "xpi" (I don't know why GitHub's version of the zip file can't be used directly, but unzipping and rezipping seems to work).

If you have trouble getting the .xpi file to work with Firefox, there is one other method you can try.  Save all of the unzipped Zutilo files somewhere on you computer where you want to keep Zutilo.  Create a text file named zutilo@www.wesailatdawn.com, put the directory path to Zutilo's chrome folder as its only line of text, and save the file in the extensions folder of your Firefox profile folder (this method would probably also work with Zotero Standalone if you could find its extensions folder).  This method is useful if you want to use git to pull in updates to Zutilo from GitHub (though if you use Zutilo in Firefox and install it from the Mozilla Add-ons page Firefox should automatically update Zutilo once updates get approved by Mozilla (a little bit after they are posted to GitHub)).

Feature Requests and Bug Submissions
------------------------------------

The latest source code for Zutilo is maintained on [GitHub](https://github.com/willsALMANJ/Zutilo "Zutilo's GitHub page").  Bugs can be reported by clicking on the "New Issue" button under [the Issues section](https://github.com/willsALMANJ/Zutilo/issues "GitHub Issues page") of the GitHub site.  You can also check there to see if a bug you experience has already been reported by another user.  Make sure to check the "closed" tab of the Issues section to see if the bug has already been addressed.  Feature requests may also be submitted by opening a new issue.  Please open a new issue before submitting your code.

Efforts will be taken to fulfill requests for locales of Zutilo in languages other than English.

Log of Important Zutilo Changes
-------------------------------
This section is not a complete log of changes to Zutilo.  It will include any major changes to Zutilo's functionality or added features.  If something breaks on an upgrade of Zutilo, try looking in this section for an explanation.

* As of version 1.2.1, Zutilo can be installed and uninstalled without restarting Firefox.

* As of version 1.1.16, modifyAttachments can now replace elements of the path other than the beginning.

* As of version 1.1.15, modifyAttachments should actually work with Windows paths.

* As of version 1.1.11, the main JavaScript object that Zutilo creates to add functionality to Zotero has been renamed from "Zotero.Zutilo" to "ZutiloChrome.zoteroOverlay".  Any keyboard shortcuts calling methods of this object need to switch names in order to keep working.

Credits
-------

Zutilo is based is modeled on the Firefox extension format suggested in the [XUL School tutorial](https://developer.mozilla.org/en-US/docs/XUL_School).  Additionally, examples were taken from the [Mozilla Developer Network](https://developer.mozilla.org/) documentation and the Zotero source code.
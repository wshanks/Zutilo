### Attachments

#### Linked file attachments (relative paths)

Zotero can work with either imported attachments, stored in Zotero's storage and able to be sync'ed to Zotero's servers, or linked file attachments, stored as file system paths to the location of the attachment files.
When storing attachments as linked files, the relative attachment paths feature in Zotero can be useful.
With this feature, a base attachment directory is selected and then any linked file attachments in this directory are saved with paths relative to this path.
Because these paths are relative, you can move all your attachments to a new directory and all you have to do is update this base directory setting in Zotero rather than updating the path to each individual attachment.
If you use more than computer, you can set the base attachment directory to a different location on each machine (e.g. a DropBox or SyncThing folder) and still have all of the links to attachments work by setting this preference to the right location on each machine.
Relative attachment paths can be configured under the "Files and Folders" tab of the Advanced Section of Zotero's preferences.

#### Linked file attachment organization (ZotFile)

The [ZotFile extension](http://www.columbia.edu/~jpl2136/zotfile.html) provides extra support for linked file attachments in Zotero.
ZotFile can be set to automatically convert new imported file attachments to linked file attachments and rename and move the attachment files to a file location based on the attachment parent's metadata.
This feature makes maintaining a directory of linked file attachments as easy as using Zotero's imported attachments.
You can, for example, have ZotFile store attachments in directories named after the journal with a subfolder for the publication year and then name the attachment file after the author and title of the work.
ZotFile has several other features for working with attachments that are worth investigating in its documentation.

#### Attaching browser content to item

Zutilo provides functions for attaching a web link or the current web page to the currently selected item.
In Zutilo's preferences, these functions can be set to create either imported or linked file attachments, or to import the first attachment for an item and then prompt for linked files after that.
Note that Zutilo's linked file attachment method triggers ZotFile, so, if ZotFile is set up to rename and move attachments, it will rename and move the ones saved this way no matter where you choose to save them with Zutilo's prompt.
ZotFile has a "only ask if item has other attachments" option.
This option works well with the Zutilo option to prompt for the location of attachments after the first.

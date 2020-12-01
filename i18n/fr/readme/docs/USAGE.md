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

### Item field modification functions

Zutilo provides several functions for copying and pasting item fields.
The functions are meant to help completing metadata manually. Here are some use cases.

#### Copy + Paste-into-empty: Completing records

You have a series of PDFs, for which metadata is not recognised automatically, such as the chapters of a book.  
You want to copy a set of metadata from the ‘source record’ to ‘target records’, without overwritten the information already available in the target records.

1. You complete a ‘book section’ record for the first PDF (including editors, book title, publication year, etc).

2. You then use Copy on this record, and Paste-into-empty onto all of the other records.
  In this, you don’t need to worry about existing metadata (in the target records) as this is not overwritten.

For example, if the target records already have titles and authors, those titles are kept while  editors, book title, publication year, etc is merged into the record.
You can be sure that no information from the target records is lost.

#### Copy + Paste-non-empty: Conforming records

You have a series of PDFs for which metadata was recognised, such as papers contained in a journal volume.
However, the name of the journal and the year of the volume are incorrect.

1. Create a new journal paper record and enter the required information (name of the journal and year).

2. Copy the record.

3. Paste-non-empty the target records. This copies all non-empty fields from the source onto the target.

As a result, the target records now all have the same Journal name and the same year (irrespective of the prior setting).

#### Copying authors

Copy+Paste-into-empty, Copy+Paste-non-empty and Copy+Paste-all behave differently with regard to copying authors.

* Copy+Paste-into-empty merges additional authors: Authors present in the source are added to the target.

* Copy+Paste-non-empty replaces authors: Authors present in the source replace authors present in the target.
In other words, the authors in the target are removed, and the authors from the source are added to the target.

* Copy+Paste-all replaces authors; if the author field in the source is empty, then authors in the target are also cleared.

The above option offer some likely scenarios, while keeping the number of paste-options to just three.
Three examples which aren’t covered are

1.  Completing records but not adding to authors.
  To do this, duplicate the source record, remove the authors and then do a Paste-into-empty.

2. Conforming records but not replacing authors.
  To do this, duplicate the source record, remove the authors and then do a Paste-non-empty.

3. Conforming records but merging authors.
  To do this, duplicate the source record, remove the authors and then do a Paste-non-empty.
Then copy the original source record, and do a Paste-into-empty.

#### Copy + Paste-all: Copying item metadata between libraries

If you are using copy + Paste-all, in sequence and onto the same item type, you are setting all source fields to the target (in a sense, duplicating the item).
A use case for this is this is to easily sync items across two libraries.
You have an item with correct metadata in one library, but with incorrect metadata in another library.
Copy + Paste-all command copies all metadata from the item in one library onto the other.
It updates fields on the target from the source.
This also clears all fields in the target that are empty in the source.

1. An item was copied from library A to B.
  The metadata in A is subsequently corrected, and now needs to be copied onto the target item in library B.

2. Copy the source item in library A

3. Paste-all onto the target item in library B

4. The metadata of the target item is now identical to the source item.

Note that effectively Copy+Paste-all is similar to a duplicate.
However, in some circumstances it’s easier to do.

* For example, between libraries you’d first have to duplicate, then drag the item, then move attachments in the new library.
  Creation time would also not be preserved.

* Suppose you create one item, you duplicate it.
  You move all the PDFs to the duplicates as needed.
Now you notice a mistake (involving an empty field, e.g. moving Series to Series Title, while clearing Series).
You just correct the original record, and use Paste-all.
The Series filled is cleared, and Series TItle is filled.

#### Copy + edit + Paste-all: Clearing certain item fields in a large number of records

You are creating a public library B from a library A.
In this process, you want to clear some fields from a set of items in library B.
For example, you may wish to remove a set of archive locations, or extras, or similar.

1. Create a blank item (of the same type), copy it.

2. Edit the JSON on the clipboard to keep only fields to be cleared.

3. Then use Paste-all to clear those fields in a number of source items.


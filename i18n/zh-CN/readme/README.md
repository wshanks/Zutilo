# Zutilo

Zutilo is a plugin for [Zotero](http://www.zotero.org/) (both the Firefox addon and the standalone client).
Zutilo adds several functions not available in base Zotero through extra menu items and keyboard shortcuts.
Here are some of Zutilo's features:

* Copy, paste, and remove sets of tags
* Select and right-click to relate several items
* Copy items to the clipboard in several formats
* Keyboard shortcuts for editing items and focusing and hiding different elements of the Zotero user interface
* Right-click to save link or document as an attachment to currently selected item (only for Zotero as a Firefox addon)

Zutilo strives to enable whatever Zotero workflow is desired and otherwise to get out of the way.
All of Zutilo's graphical elements can be disabled individually, so that unwanted features do not clutter the user interface.

## Installation

### Firefox

The latest released version of Zutilo is available from [Zutilo's Mozilla Add-ons page](https://addons.mozilla.org/en-US/firefox/addon/zutilo-utility-for-zotero/).
Just click the "Add to Firefox" button.

### Zotero Standalone

Download the Zutilo `.xpi` file from [Zutilo's Mozilla Add-ons page](https://addons.mozilla.org/en-US/firefox/addon/zutilo-utility-for-zotero/).
If you visit the page in Firefox, the download link is a button that says "Add to Firefox" (it says "Download now" in other browsers).
Right-click this button and choose "Save as".

Once you have the Zutilo xpi file, go to Tools->Add-ons in Zotero Standalone.
Click on the gear button in the upper right area of the Add-ons Manager window that appears and choose "Install Add-on From File."
Then select the downloaded `.xpi` file.

## Getting started

Zutilo can be customized via its preferences window, which can reached either via the Firefox Addons Manager or the Zotero action menu (the gear icon).

### Zotero item menu

By default, Zutilo adds a set of menu items to a submenu (named `Zutilo`) of the menu that appears when an item is right-clicked in Zotero.
Which items appear can be set in Zutilo's preferences window.
Items can be set to appear in the Zutilo submenu or directly in the Zotero item menu.
Not all available functions are visible in Zutilo submenu by default.

### Keyboard shortcuts

All of the functions that can appear in the item menu can also be called by keyboard shortcuts.
Zutilo also provides some additional keyboard shortcut functions that are not available from the item menu.
By default, no keyboard shortcuts are defined.
A shortcut key combination can be set for each function in Zutilo's preferences.
If the key combination is already assigned for another Firefox function, a warning will be displayed.

### Firefox specific functions

Zutilo adds entries to the Zotero address bar icon's menu for saving items into Zotero with the opposite attachment behavior from that set in Zotero's preferences.
So if you have Zotero set to download attachments when saving an item, Zutilo will add an entry to save the item without attachments.
The extra menu items can be disabled in Zutilo's preferences.

Zutilo adds two entries to right-click menu in Firefox, one to save the current page as an attachment (most useful when the page is a pdf) and another to save a link as an attachment (if a link was right-clicked).
These menu items appear the Zotero submenu of the Firefox right-click menu.
In Zutilo's preferences, the menu items can be set to appear in the right-click menu directly (instead of the Zotero submenu) or can be disabled.
Whether the attachment files are imported to Zotero or downloaded and linked to Zotero items can be also be set in Zutilo's preferences.

## Usage notes

For additional notes on usage, see [USAGE](USAGE.md).

## Command reference

For a detailed list of Zutilo's commands, please see the [command reference](COMMANDS.md).

## Support

For guidelines regarding bug reports, feature requests, and translation help, please see the [feedback page](BUGS.md).

## Development

For notes on working with the Zutilo code, please see the [build document](BUILD.md).

## Credits

For a list of acknowledgments, please see the [author page](AUTHORS.md).

## Changes

For a summary changes by version number, please see the [changelog](CHANGELOG.md).

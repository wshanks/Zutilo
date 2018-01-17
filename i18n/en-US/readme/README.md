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

**NOTE:** As of version 3.0, Zutilo is distributed from the [GitHub releases page](https://github.com/willsALMANJ/Zutilo/releases).
New updates will not be published to the location checked by previous versions of Zutilo (the Mozilla Add-ons page).
To receive new Zutilo updates, please update to the latest version of Zutilo.

## Installation

Download the Zutilo `zutilo.xpi` file from [Zutilo's GitHub releases page](https://github.com/willsALMANJ/Zutilo/releases).
Then go to Tools->Add-ons in Zotero Standalone.
Click on the gear button in the upper right area of the Add-ons Manager window that appears and choose "Install Add-on From File."
Then select the downloaded `zutilo.xpi` file.

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

For additional notes on usage, see [USAGE](docs/USAGE.md).

## Command reference

For a detailed list of Zutilo's commands, please see the [command reference](docs/COMMANDS.md).

## Support

For guidelines regarding bug reports, feature requests, and translation help, please see the [feedback page](docs/BUGS.md).

## Development

For notes on working with the Zutilo code, please see the [build document](docs/DEVELOPERS.md).

## Credits

For a list of acknowledgments, please see the [author page](AUTHORS.md).

## Changes

For a summary changes by version number, please see the [changelog](CHANGELOG.md).

## How to Contribute

1. Star the repository on GitHub. The number of stars on GitHub is one of the most visible metrics for gauging the level of interest in project.
2. Encourage others to use the project, either directly or by writing a blog post. Besides GitHub stars, the other metric for gauging interest in the project is the total number of downloads of the xpi.
3. Submit new features or translations. However, keep in mind that new features add to the maintenance burden of the project. So get in contact before putting a lot of time into a new feature.

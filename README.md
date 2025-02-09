# Zutilo
Zutilo is a plugin for [Zotero](http://www.zotero.org/).
Zutilo adds several functions not available in base Zotero through extra menu items and keyboard shortcuts.
Here are some of Zutilo's features:

* Copy, paste, and remove sets of tags
* Select and right-click to relate several items
* Copy items to the clipboard in several formats
* Keyboard shortcuts for editing items and focusing and hiding different elements of the Zotero user interface

Zutilo strives to enable whatever Zotero workflow is desired and otherwise to get out of the way.
All of Zutilo's graphical elements can be disabled individually, so that unwanted features do not clutter the user interface.

> [!NOTE]
> Zutilo is largely maintained by one person (@wshanks) who does not have much time for Zutilo any more.
> @wshanks still uses Zotero but not as heavily and so has less need for the power user featurs of Zutilo.
> Additional help adapting to new releases of Zotero and fixing other bugs is very welcome.
> Without additional contributors, Zutilo may not be able to keep compatibility with future releases of Zotero.
> As of Zotero version 7.0, some features of Zutilo, mainly keyboard short cuts no longer function.
> There was alos a long gap between the release of Zotero 7 and a release of Zutilo that could be installed with it.

## Installation

Download the Zutilo `zutilo.xpi` file from [Zutilo's GitHub releases page](https://github.com/wshanks/Zutilo/releases).
Then go to Tools->Add-ons in Zotero Standalone.
Click on the gear button in the upper right area of the Add-ons Manager window that appears and choose "Install Add-on From File."
Then select the downloaded `zutilo.xpi` file.

**NOTE for Firefox users:** Firefox treats `.xpi` files as Firefox add-ons and tries to install them.
Rather than clicking on the `.xpi` file, you can try right-clicking and choosing to save the link as a file.
In some cases (particularly on Linux), Firefox does not allow right-clicking and saving the `.xpi` link either.
In that case, you must download it either with a different browser or with a command-line tool like `curl` or `wget`.

## Getting started

Zutilo can be customized via its preferences window, which can reached via the Zotero Addons Manager or the Tools menu.

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
If the key combination is already assigned for another function, a warning will be displayed.

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

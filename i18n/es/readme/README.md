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

**NOTE:** As of version 3.0, Zutilo is distributed from the [GitHub releases page](https://github.com/wshanks/Zutilo/releases).
New updates will not be published to the location checked by previous versions of Zutilo (the Mozilla Add-ons page).
To receive new Zutilo updates, please update to the latest version of Zutilo.

## Compatibilidad

Esta rama (`z11`) de Zutilo está destinada a Zotero 10 y Zotero 11; requiere al menos Zotero 10.0.
Todas las funciones de Zutilo, los menús contextuales de elementos y colecciones y los ajustes se ejecutaron mediante un script con elementos de prueba en Zotero 10.0.8 y en Zotero 11.0-beta.4, con los mismos resultados en ambos.
El editor de atajos de teclado ha vuelto: en los ajustes de Zutilo, haga clic en el atajo de una función y luego pulse las teclas.
Eliminados en esta rama, porque no pueden funcionar en Zotero 10 ni en Zotero 11:

* «Pin key» y «Unpin key» de Better BibTeX: Better BibTeX 9 ya no tiene estas funciones (la clave de cita está en el campo propio de Zotero «Clave de cita»).
* Los atajos de ZotFile y Mdnotes: ninguno de los dos complementos tiene una versión para Zotero 7 o posterior.

Los atajos ya guardados para estas funciones se ignoran.

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

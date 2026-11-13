### Building Zutilo
To build the Zutilo `xpi` file, run `make` in the top level of the repository.
This command creates `build/zutilo.xpi`.
In order to build Zutilo, `make` and `zip` are needed.
The build just zips everything in the `addon/` folder into `zutilo.xpi`, which you can also do by hand.

### Overview of Zutilo codebase
Most of the Zutilo logic is contained in the files in `addon/chrome/content/zutilo`.
The highlights are:

* `zutilo.mjs`
  - `addon/bootstrap.js` loads this file when Zutilo starts up and it handles the rest of the Zutilo setup.
  - This file defines the `Zutilo` module.
  - The `Zutilo` module contains properties about Zutilo that are window independent.
  - The `Zutilo` module creates observers and listeners for loading the rest of the Zutilo code into each window.

* `zutiloChrome.js`
  - Contains some basic UI element helper functions unrelated to specific Zutilo features

* `zoteroOverlay.js`
  - Contains all of the functions that extend Zotero's UI and all of the Zutilo defined functions that interact with Zotero data

* `keys.js`
  - Defines all of Zutilo's keyboard shortcut functions
  - To define a new shortcut:
	1. Create a new method of `keys.shortcuts` that is a function of a `window` object.
	2. Create a new entry in `addon/chrome/locale/en-US/zutilo/zutilo.properties` for `zutilo.shortcuts.name.<method_name>` where `<method_name>` is the method name used in step 1 (technically, you should create this entry for all other locales as well).

* `preferences.js`
  - Code for the Zutilo pane of Zotero's settings: the menu placement of each function and the keyboard shortcut editor

* `preferences.xhtml`, `preferences.css`
  - Static layout and style of that settings pane.

The UI strings are in `addon/chrome/locale/<locale>/zutilo/zutilo.properties` (function names, menu labels, messages) and `addon/locale/<locale>/zutilo.ftl` (the settings pane, Fluent).

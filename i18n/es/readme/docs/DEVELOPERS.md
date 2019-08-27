### Building Zutilo
To build the Zutilo `xpi` file, run `make` in the top level of the repository.
This command creates `build/zutilo.xpi`.
In order to build Zutilo, the following programs are needed:

* zip
* pandoc
* python (version 3)
* GNU coreutils (need make and sed to work)

As a quick work around, you can just zip everything in the `addon/` folder and name it `zutilo.xpi`.
The `make` machinery is mainly used for converting the README files from `markdown` to `html` and including them in the `xpi` file, but for testing you can just ignore the README file.

### Overview of Zutilo codebase
Most of the Zutilo logic is contained in the files in `addon/chrome/content/zutilo`.
The highlights are:

* `zutilo.js`
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

* `keyconfig_adapted.js`
  - Code adapted from the KeyConfig extension for setting up Zutilo's keyboard shortcuts

* `preferences.js`
  - Code for populating the preferences window dynamically

* `preferences.xul`
  - Static layout for the preferences window.

The other relevant content of the addon are the `zutilo.properties` and `zutilo.dtd` files which contain the dynamically and statically loaded UI strings for Zutilo.
These are located in the various different locale folders under `addon/chrome/locale`.

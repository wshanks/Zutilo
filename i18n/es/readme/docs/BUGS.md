# Bugs

The latest source code for Zutilo is maintained on [GitHub](https://github.com/willsALMANJ/Zutilo "Zutilo's GitHub page").
Bugs can be reported by clicking on the "New Issue" button under [the Issues section](https://github.com/willsALMANJ/Zutilo/issues "GitHub Issues page") of the GitHub site.
You can also check there to see if a bug you experience has already been reported by another user.
Make sure to check the "closed" tab of the Issues section to see if the bug has already been addressed.

If you prefer, you may contact the author directly via email, using the contact information on the GitHub, but note that posting issues publicly may help others with the same problem.

#### Note on compatibility

Zotero version 5.0 introduced numerous backwards incompatible changes.
Zutilo versions 2.x will maintain compatibility with Zotero 4.x and 5.x.
Zutilo version 3.x will drop compatibility with Zotero 4.x (at whatever time seems appropriate).

#### Suggestions for bug reports

When submitting bug reports, please include the following:

1. Version of Zutilo used
2. Version of Zotero used
3. Version of Firefox used (if applicable)
4. Step-by-step instructions to reproduce the bug

The versions of Zutilo and Zotero can be looked up in the Addons Manager (`about:addons`) in Firefox.
The version of Firefox can be found in `Help->About Firefox`.
For Zotero Standalone, the version of Zutilo can be found in `Tools->Addons` and the version of Zotero in `Help->About Zotero`.

Additionally, if possible please provide any javascript errors that appear in the Browser Console when the bug occurs.
The Browser Console can be opened with `Ctrl+Shift+J` (`Cmd+Shift+J` on OS X).
Try to clear the output, reproduce the bug, and then check the Browswer Console to see if any messages related to Zutilo or Zotero appeared.
While it is technically possible to open the Browser Console in Zotero Standalone, it is quite difficult to do.
It is recommended to try to reproduce the bug in Firefox in order to check for Browser Console messages.

# Feature requests

Feature requests may also be submitted by opening a new issue.
If you would like to contribute a patch, please open a new issue before submitting your code.
A description of the kinds of features that are appropriate for Zutilo can be found on [the Zutilo wiki page](https://github.com/willsALMANJ/Zutilo/wiki).
A roadmap of planned features is also available on the wiki.

# Translation

New translations or improvements to existing translations are very welcome!
Zutilo has used (www.babelzilla.org) and (www.transifex.com) for translation services, but these sites are not kept up to date with the latest files due to lack of interest by translators.
If you would like to help with translation using one of these sites or another site, please get in touch!

When performning a translation, please translate all of the files in `chrome/locale/<locale_name>/zutilo` except `README.html` and all of the files in `Extra/locale/<locale_name>`.
For text files like `README.md`, please try put each sentence on a new line so that the translation file corresponds line by line with the English version.

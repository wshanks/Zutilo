Here is a quick overview of Zutilo's utility scripts:

* updateREADME.sh
Copies `README.md` from the root directory to the `Extra/locale/en-US` directory and then converts `README.md` to html for each locale and moves that html file into the appropriate locale subdirectory of `chrome/locale`.

* zipCommand.sh
Generate the zutilo.xpi file by zipping all of the necessary files together.

* AMO_README.py
Generates stripped down versions of README.html for each locale by removing the tags not allowed in add-on descriptions on (addons.mozilla.org) and saves these html files in `Extra/AMO`.

* build.sh
Runs `updateREADME.sh`, `zipCommand.sh`, and `AMO_README.py`.

* Add_external_locale_files.py, Remove_external_locale_files.py
These files copy and delete the files in `Extra/locale` from the corresponding locale directories in `chrome/locale`. These files are localized strings related to Zutilo that do not get packaged in the add-on itself (e.g. the markdown version of the README file and the captions for the figures on (addons.mozilla.org)). These scripts are useful for submitting the add-on for translation on [BabelZilla](www.babelzilla.org) which only accepts the XPI file of the add-on and then parses it for the localized portion to present the strings to translators.

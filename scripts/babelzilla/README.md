# BabelZilla scripts
The purpose of these scripts is to copy locale files not included in the Zutilo `xpi` file into the addon directory, so that they would be included in the Zutilo `xpi` (and then also to remove).
The reason for doing this is that BabelZilla only accepts `xpi` files, so if you want strings to be translated they have to be formated as addon locale strings.
Zutilo has some auxiliary strings like the captions for the figures shown (addons.mozilla.org) which also need to be translated, so those have to be copied into the `xpi` file for BabelZilla to include them.

__NOTE:__ These scripts are out of date because BabelZilla has not been used to translate Zutilo in a long time. They could be updated if anyone wanted to translate Zutilo using BabelZilla.

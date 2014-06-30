#!/usr/bin/env python

import os, sys
import os.path

zutiloDir = os.path.dirname(os.path.realpath(sys.argv[0])) + '/../../'
internalLocales = zutiloDir + 'chrome/locale/'
externalLocale = zutiloDir + 'Extra/locale/'
internalSubdirectory = 'zutilo'
ignoredFiles = ['.DS_Store']

locales = [name for name in os.listdir(externalLocale)
           if os.path.isdir(os.path.join(externalLocale, name))]

for locale in locales:
    extLocaleDir = os.path.join(externalLocale, locale)
    files = [name for name in os.listdir(extLocaleDir)
             if os.path.isfile(os.path.join(extLocaleDir, name))]

    intLocaleDir = os.path.join(internalLocales, locale)
    intLocaleDir = os.path.join(intLocaleDir, internalSubdirectory)
    for file0 in files:
        if file0 not in ignoredFiles:
            os.remove(os.path.join(intLocaleDir, file0))

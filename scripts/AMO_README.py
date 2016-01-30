#!/usr/bin/env python

# Save an html version of Zutilo's readme without <p> flags and with
# <h#> flags changed to <strong>
import sys, os, re

locales = ['en-US', 'es', 'de', 'fr']
zutiloDir = os.path.dirname(os.path.realpath(sys.argv[0])) + '/../../'

for locale in locales:
    fin = open(zutiloDir+'chrome/locale/'+locale+'/zutilo/README.html', 'r')
    fout = open(zutiloDir+'Extra/AMO/AMO_README_'+locale+'.html', 'w')

    fullhtml = fin.read()

    scrubbedhtml = re.sub('<p>', '', fullhtml)
    scrubbedhtml = re.sub('</p>', '\n', scrubbedhtml)
    scrubbedhtml = re.sub('h[1-9]>', 'strong>', scrubbedhtml)
    scrubbedhtml = re.sub('<br />', '\n', scrubbedhtml)

    fout.write(scrubbedhtml)
    fin.close()
    fout.close()

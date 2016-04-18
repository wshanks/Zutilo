#!/usr/bin/env python
'''Copy new, uncommitted strings from English to non-English locales in lieu of
getting translations'''

from glob import iglob
from itertools import chain
import os
# NOTE: requires Python >= 3.5
from subprocess import run, PIPE


def update_locales(changed_file, path_template):
    '''Diff changed_file and update non-English locale files in
    path_template

    changed_file: path to changed file relative to root of git repo
    path_template: path to locale files to update relative to root of repo with
        locale directory replaced by "{locale}"'''
    result = run(['git', '--no-pager', 'diff', changed_file],
                 universal_newlines=True, stdout=PIPE)
    diff = result.stdout
    if diff == '':
        return

    locales = [d for d in os.listdir('addon/chrome/locale') if d != 'en-US']

    for loc in locales:
        run(['patch', '-F', '4', path_template.format(locale=loc)],
            universal_newlines=True,
            input=diff)


def main():
    '''Main logic'''
    # Need to be somewhere in git repo for git commands to work
    os.chdir(os.path.dirname(os.path.realpath(__file__)))
    # Rest of script assumes working directory is root of git repo
    result = run(['git', 'rev-parse', '--show-toplevel'],
                 universal_newlines=True, stdout=PIPE)
    os.chdir(result.stdout.strip())

    for doc in chain(iglob('i18n/en-US/readme/*.md'),
                     iglob('i18n/en-US/readme/docs/*.md')):
        update_locales(doc, doc.replace('en-US', '{locale}'))
    update_locales('addon/chrome/locale/en-US/zutilo/zutilo.properties',
                   'addon/chrome/locale/{locale}/zutilo/zutilo.properties')
    update_locales('addon/chrome/locale/en-US/zutilo/zutilo.dtd',
                   'addon/chrome/locale/{locale}/zutilo/zutilo.dtd')

main()

#!/usr/bin/env python3
'''Script to copy file contents staged in git between two root directories'''

from glob import glob
import os
import shutil
import stat
# NOTE: requires Python >= 3.5
from subprocess import run, PIPE


LOCALE_PATH = 'i18n/en-US/readme'
TOP_LEVEL_DOCS = set(glob('*.md') + glob('docs/*.md'))


class GitStagingError(Exception):
    '''Exception class for unexpected git states'''
    pass


def cd_to_git_root():
    '''Change to root directory of the git repo containing this file'''
    os.chdir(os.path.dirname(os.path.realpath(__file__)))
    # Rest of script assumes working directory is root of git repo
    mod_env = os.environ.copy()
    if 'GIT_DIR' in mod_env:
        del mod_env['GIT_DIR']
    result = run(['git', 'rev-parse', '--show-toplevel'],
                 universal_newlines=True, stdout=PIPE, env=mod_env)
    os.chdir(result.stdout.strip())


def get_changed_docs():
    '''Get set of changed locale files'''
    result = run(['git', 'status', '--porcelain'],
                 universal_newlines=True, stdout=PIPE)
    changes = result.stdout.strip().splitlines()

    changed_docs = set()
    for change in changes:
        status = change[0]
        path = change[3:]

        if path in TOP_LEVEL_DOCS:
            if status not in ('M', ' '):
                raise GitStagingError('Unexpected status %s for path %s' %
                                      (status, path))
            if status != ' ':
                changed_docs.add(path)

    return changed_docs


def make_writeable(path):
    '''Make file at path writeable by the user'''
    info = os.stat(path)
    os.chmod(path, stat.S_IWUSR | stat.S_IMODE(info.st_mode))
    return info.st_mode


def make_readonly(path):
    '''Make file read only'''
    for bit in (stat.S_IWUSR, stat.S_IWGRP, stat.S_IWOTH):
        info = os.stat(path)
        # Do this the ugly way because these bits are being set with integers,
        # so bitwise negate does not do what we want
        os.chmod(path, (stat.S_IMODE(info.st_mode) -
                        (stat.S_IMODE(info.st_mode) & bit)))


def copy_staged_changes(changed_docs):
    '''Copy staged changes to other path location'''
    mod_env = os.environ.copy()
    if 'GIT_DIR' in mod_env:
        del mod_env['GIT_DIR']

    for path in changed_docs:
        working_tree_path = os.path.join(LOCALE_PATH, path)

        make_writeable(working_tree_path)
        shutil.copyfile(path, working_tree_path)
        make_readonly(working_tree_path)
        run(['git', 'add', working_tree_path], env=mod_env)


def main():
    '''Main logic'''
    # Need to be somewhere in git repo for git commands to work
    cd_to_git_root()

    # Get changes
    changed_docs = get_changed_docs()

    # Copy staged changes to other location
    copy_staged_changes(changed_docs)


if __name__ == '__main__':
    main()

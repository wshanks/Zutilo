#!/usr/bin/env python3
'''Deploy new Zutilo release'''
import argparse
from functools import total_ordering
import os
import re
import shutil
import subprocess
import tempfile

import requests
from uritemplate import expand
import yaml


VERSION_FMT = '^(?P<major>\d+)\.(?P<minor>\d+)\.(?P<micro>\d+)(?P<beta>b\d+)?$'


def check_version(version):
    '''Sanity check version string

    Version should be well-formed, larger than current version and not already
    exist
    '''
    if not re.match(VERSION_FMT, version):
        raise ValueError('Invalid version: %s', version)


@total_ordering
class Version(object):
    def __init__(self, string='', version_tuple=None):
        if string:
            if string[0] == 'v':
                string = string[1:]

            match = re.match(VERSION_FMT, string)
            if not match:
                raise ValueError('Invalid version: %s', string)
            self.major = int(match.group('major'))
            self.minor = int(match.group('minor'))
            self.micro = int(match.group('micro'))
            if match.group('beta') is not None:
                self.beta = int(match.group('beta').strip('b'))
            else:
                self.beta = None
        else:
            self.major = version_tuple[0]
            self.minor = version_tuple[1]
            self.micro = version_tuple[2]
            if len(version_tuple) == 4:
                self.beta = version_tuple[3]
            else:
                self.beta = None

    def __str__(self):
        if self.beta:
            beta_str = 'b{beta}'.format(beta=self.beta)
        else:
            beta_str = ''
        return '{major}.{minor}.{micro}{beta}'.format(major=self.major,
                                                      minor=self.minor,
                                                      micro=self.micro,
                                                      beta=beta_str)

    def __eq__(self, other):
        return str(self) == str(other)

    def __gt__(self, other):
        if self.major > other.major:
            return True
        elif self.major == other.major:
            if self.minor > other.minor:
                return True
            elif self.minor == other.minor:
                if self.micro > other.micro:
                    return True
                elif self.micro == other.micro:
                    if ((self.beta > other.beta) or
                            (self.beta is None and other.beta is not None)):
                        return True
        return False


def get_last_version():
    '''Get last version from git tags'''
    proc = subprocess.run(['git', 'tag'], universal_newlines=True,
                          stdout=subprocess.PIPE)
    tags = proc.stdout.splitlines()
    newest = Version(version_tuple=(0, 0, 0))
    for tag in tags:
        try:
            version = Version(string=tag)
        except ValueError:
            continue
        if version.beta is not None:
            continue

        if version > newest:
            newest = version

    return version


def get_git_root():
    proc = subprocess.run(['git', 'rev-parse', '--show-toplevel'],
                          universal_newlines=True, stdout=subprocess.PIPE)
    return proc.stdout.strip()


def get_current_version(version_file):
    with open(version_file) as file_:
        for line in file_.readlines():
            match = re.search('<em:version>(\d+\.\d+\.\d+.*)</em:version>',
                              line)
            if match:
                return Version(string=match.group(1))


def check_versions(last_version, current_version, release):
    'Check last, current, next versions are in order'
    print('Last version:', last_version)
    print('Current version:', current_version)
    print('New version:', release)
    if last_version > current_version:
        raise Exception('Current version older than last version. '
                        'Working from old branch?')
    if release < current_version:
        raise Exception('Requested release not newer than current version.')


def replace_string(filepath, regex, replacement):
    pattern = re.compile(regex)
    with tempfile.NamedTemporaryFile(mode='w', delete=False) as tmp_file:
        with open(filepath) as src_file:
            for line in src_file:
                tmp_file.write(pattern.sub(replacement, line))

    shutil.copystat(filepath, tmp_file.name)
    shutil.move(tmp_file.name, filepath)


def update_version(release, filepath):
    'Update repo contents for new release and commit changes'
    check_git_clean()

    replace_string(filepath, '(<em:version>)(.*)()</em:version>)',
                   '\1{}\3'.format(release))

    subprocess.run(['git', 'add', filepath], check=True)
    msg = 'Version {}'.format(release)
    subprocess.run(['git', 'commit', '-m', msg], check=True)
    tag = 'v{}'.format(release)
    subprocess.run(['git', 'tag', tag], check=True)


def check_git_clean():
    subprocess.run(['git', 'diff-files', '--quiet'], check=True)


def build(release):
    orig_dir = os.path.abspath(os.curdir)
    git_root = get_git_root()
    os.chdir(git_root)
    subprocess.run(['make', 'clean'], check=True)
    subprocess.run(['make'], check=True)
    # TODO: handle if zutilo-{version}.xpi already exists?
    shutil.move(os.path.join(git_root, 'build/zutilo.xpi'),
                os.path.join(git_root, 'build/zutilo-{}.xpi'.format(release)))
    os.chdir(orig_dir)


def github_release(release, user, repo, token, files):
    api_url = 'https://api.github.com/repos/{user}/{repo}/releases'
    api_url = api_url.format(user=user, repo=repo)

    def get_release_json():
        tag_url = api_url + '/tags/{release}'.format(release=release)
        req = requests.get(tag_url)
        release_json = req.json()
        if ('message' in release_json and
                release_json['message'] == 'Not Found'):
            return False
        return release_json

    release_json = get_release_json()

    if not release_json:
        headers = {'Authorization': 'token {}'.format(token)}
        req = requests.post(api_url,
                            json={'tag_name': release},
                            headers=headers)
        req.raise_for_status()
        release_json = get_release_json()

    for file_ in files:
        upload_url = expand(release_json['upload_url'],
                            {'name': os.path.basename(file_['path'])})
        headers = {'Content-Type': file_['type'],
                   'Authorization': 'token {}'.format(token)}
        req = requests.post(upload_url, headers=headers,
                            data=open(file_['path'], 'rb'))
        req.raise_for_status()


def push_release(release, config):
    subprocess.run(['git', 'push'])
    subprocess.run(['git', 'push', '--tags'])
    # TODO: github release
    if 'github' in config:
        github_release(release, **config['github'])


def update_to_beta(release, filepath):
    beta_release = Version(version_tuple=(release.major,
                                          release.minor,
                                          release.micro+1,
                                          1))
    replace_string(filepath, '(<em:version>)(.*)()</em:version>)',
                   '\1{}\3'.format(beta_release))
    subprocess.run(['git', 'add', filepath], check=True)
    msg = 'Bump version to beta {}'.format(release)
    subprocess.run(['git', 'commit', '-m', msg], check=True)


def parse_args():
    '''Parse command line arguments'''
    parser = argparse.ArgumentParser('Deploy XPI release')
    parser.add_argument('--release', '-r', required=True,
                        help='Release version string')
    parser.add_argument('--config', '-c', default='config.yaml'
            help='Config file')

    return parser.parse_args()


def main():
    '''Main logic'''
    args = parse_args()

    # Get versions
    git_root = get_git_root()
    last_version = get_last_version()
    current_version = get_current_version(os.path.join(git_root,
                                                       'addon/install.rdf'))
    release = Version(args.release)
    if os.path.exists(args.config):
        with open(args.config) as file_:
            config = yaml.load(file_)
    else:
        config = {}

    # Check versions
    # TODO: resume from intermediate state?
    check_versions(last_version, current_version, release)

    update_version(release, os.path.join(git_root, 'addon/install.rdf'))

    build(release)

    push_release(release, config)

    # Bump version to next beta
    update_to_beta(release, os.path.join(git_root, 'addon/install.rdf'))


if __name__ == '__main__':
    main()

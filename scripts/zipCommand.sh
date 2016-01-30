#!/bin/bash
DIR="$( cd -P "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "${DIR}/../.."
zip -FSr zutilo.xpi chrome chrome.manifest install.rdf LICENSE.md README.md bootstrap.js -x \*.DS_Store \*.swp

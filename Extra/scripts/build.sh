#!/bin/bash
DIR="$( cd -P "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "${DIR}"
bash updateREADME.sh
bash zipCommand.sh

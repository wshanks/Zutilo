#!/bin/bash
locales=('en-US' 'de' 'fr' 'es' 'zh-CN')

DIR="$( cd -P "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "${DIR}/../.."
cp README.md Extra/locale/en-US
for locale in "${locales[@]}"; do
	cd "${DIR}/../../Extra/locale/${locale}"
	pandoc -f markdown_strict -t html README.md > README.html
	mv README.html "${DIR}/../../chrome/locale/${locale}/zutilo/README.html"
done

cd "${DIR}/../.."
python Extra/scripts/AMO_README.py

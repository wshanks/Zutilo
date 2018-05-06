BLDDIR = build

LOCALES := $(shell ls i18n)

INTERNAL_READMES := $(patsubst %, addon/chrome/locale/%/zutilo/README.html, $(LOCALES))
AMO_READMES := $(patsubst %, $(BLDDIR)/amo_readme/%/README.html, $(LOCALES))

# Necessary because zip copies leading directories if run from above targets
ABS_BLDDIR := $(shell realpath $(BLDDIR))

all: xpi amo_readme

xpi: $(BLDDIR)/zutilo.xpi

$(BLDDIR)/zutilo.xpi: $(INTERNAL_READMES)
	@mkdir -p $(dir $@)
	cd addon; zip -FSr $(ABS_BLDDIR)/zutilo.xpi * -x \*.swp

addon/chrome/locale/%/zutilo/README.html:
	@mkdir -p $(BLDDIR)/internal_readme/$*
	scripts/substitute_relative_links i18n/$*/readme/README.md $(BLDDIR)/internal_readme/$*/README.md
	pandoc -f markdown_strict -t html \
		$(BLDDIR)/internal_readme/$*/README.md > \
		addon/chrome/locale/$*/zutilo/README.html

amo_readme: $(AMO_READMES)

$(BLDDIR)/amo_readme/%/README.html:
	@mkdir -p $(dir $@)
	scripts/substitute_relative_links \
		--link-root https://www.github.com/willsALMANJ/Zutilo/blob/master/i18n/$*/readme \
		i18n/$*/readme/README.md \
		$(BLDDIR)/amo_readme/$*/README.md
	pandoc -f markdown_strict -t html \
		$(BLDDIR)/amo_readme/$*/README.md > \
		$(BLDDIR)/amo_readme/$*/README.html
	# Strip tags not allowed on addons.mozilla.org
	sed -e 's/<p>//' -e 's#</p>#\n#' -e 's/h[1-9]>/strong>/g' -e 's#br />#\n#' \
		$(BLDDIR)/amo_readme/$*/README.html

clean:
	rm -f $(BLDDIR)/zutilo.xpi
	rm -f $(INTERNAL_READMES)
	rm -f $(AMO_READMES)
	rm -rf $(BLDDIR)/internal_readme/*

.PHONY: all clean xpi amo_readme

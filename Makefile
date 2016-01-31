DESTDIR =
BLDDIR = build

LOCALES := $(shell ls i18n)

LOCALIZED_READMES := $(patsubst %, %/readme.html, $(LOCALES))

INTERNAL_READMES := $(patsubst %, addon/chrome/locale/%/zutilo/README.html, $(LOCALES))

ABS_BLDDIR := $(shell readlink -f $(BLDDIR))

all: xpi amo_readme
	@echo $(LOCALES)
	@echo $(LOCALIZED_READMES)

xpi: $(BLDDIR)/zutilo.xpi

amo_readme:
	@echo TODO

$(BLDDIR)/zutilo.xpi: $(INTERNAL_READMES)
	@mkdir -p $(dir $@)
	cd addon; zip -FSr $(ABS_BLDDIR)/zutilo.xpi * -x \*.swp

addon/chrome/locale/%/zutilo/README.html:
	@mkdir -p $(BLDDIR)/internal_readme/$*
	scripts/substitute_relative_links i18n/$*/readme/README.md $(BLDDIR)/internal_readme/$*/README.md
	pandoc -f markdown_strict -t html \
		$(BLDDIR)/internal_readme/$*/README.md > \
		addon/chrome/locale/$*/zutilo/README.html

clean:
	rm -f $(BLDDIR)/zutilo.xpi
	rm -f $(INTERNAL_READMES)
	rm -rf $(BLDDIR)/internal_readme/*

.PHONY: all clean xpi

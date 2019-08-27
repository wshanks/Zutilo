BLDDIR = build

LOCALES := $(shell ls i18n)

INTERNAL_READMES := $(patsubst %, addon/chrome/locale/%/zutilo/README.html, $(LOCALES))

# Necessary because zip copies leading directories if run from above targets
ABS_BLDDIR := $(shell realpath $(BLDDIR))

all: xpi

0x0: $(BLDDIR)/zutilo.xpi
	curl -F'file=@$(BLDDIR)/zutilo.xpi' https://0x0.st

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

clean:
	rm -f $(BLDDIR)/zutilo.xpi
	rm -f $(INTERNAL_READMES)
	rm -f $(AMO_READMES)
	rm -rf $(BLDDIR)/internal_readme/*

.PHONY: all clean xpi

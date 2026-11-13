BLDDIR = build

# Necessary because zip copies leading directories if run from above targets
ABS_BLDDIR := $(shell realpath $(BLDDIR))

all: xpi

0x0: $(BLDDIR)/zutilo.xpi
	curl -F'file=@$(BLDDIR)/zutilo.xpi' https://0x0.st

xpi: $(BLDDIR)/zutilo.xpi

$(BLDDIR)/zutilo.xpi:
	@mkdir -p $(dir $@)
	cd addon; zip -FSr $(ABS_BLDDIR)/zutilo.xpi * -x \*.swp

clean:
	rm -f $(BLDDIR)/zutilo.xpi

.PHONY: all clean xpi

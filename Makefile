all: xpi

xpi: build/zutilo.xpi

build/zutilo.xpi:
	mkdir -p build
	zip -FSr build/zutilo.xpi addon/* -x \*.swp

clean:
	rm build/zutilo.xpi

.PHONY: all clean xpi

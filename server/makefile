GOCMD=go
GOINSTALL=$(GOCMD) install
GOCLEAN=$(GOCMD) clean
GOTEST=$(GOCMD) test
GOGET=$(GOCMD) get

APP_SRC_PATH=github.com/shharn/blog
BINARY_NAME=blog

all: test run
deps:
	$(GOGET) -d $(APP_SRC_PATH)/...
deps_test:
	$(GOGET) -u github.com/stretchr/testify
install: deps
	$(GOINSTALL) $(APP_SRC_PATH)
test: deps deps_test
	$(GOTEST) $(APP_SRC_PATH)/...
run: install
	bin/$(BINARY_NAME)
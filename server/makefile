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
install: deps
	$(GOINSTALL) $(APP_SRC_PATH)
test: deps
	$(GOTEST) $(APP_SRC_PATH)/...
run: install
	bin/$(BINARY_NAME)
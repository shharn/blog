GOCMD=go
GOBUILD=$(GOCMD) build
GOCLEAN=$(GOCMD) clean
GOTEST=$(GOCMD) test
GOGET=$(GOCMD) get

BINARY_NAME=blog

all: run
build:
	$(GOBUILD) -o bin/$(BINARY_NAME)
test:
	$(GOTEST) ./...
run: build
	bin/$(BINARY_NAME)
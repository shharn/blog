package router

import (
	"strings"

	"github.com/pkg/errors"
	"github.com/shharn/blog/logger"
)

// Params represents the param values on URL
type Params map[string]interface{}

func parseURL(pattern, path string) Params {
	if pattern[0] == '/' {
		pattern = pattern[1:]

	}
	if path[0] == '/' {
		path = path[1:]
	}

	params := Params{}
	splittedPattern, splittedPath := strings.Split(pattern, "/"), strings.Split(path, "/")
	if len(splittedPattern) != len(splittedPath) {
		return params
	}
	for index, splittedPattern := range splittedPattern {
		currPath := splittedPath[index]
		if len(splittedPattern) > 0 && splittedPattern[0] == ':' {
			params[splittedPattern[1:]] = currPath
		} else if splittedPattern != "*" && splittedPattern != currPath { // unmatched pattern & path detected
			logger.Logger.Error(errors.Errorf("Unmatched pattern & path. Pattern: %v, Path: %v", pattern, path))
			return Params{}
		} 
	}
	return params
}

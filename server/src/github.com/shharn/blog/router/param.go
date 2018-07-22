package router

import (
	"strings"
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

	// Can sure the pattern & path are exactly matched each other
	// This would be filtered before reach this point (Maybe at ... ServeHTTP method)
	splittedPattern, splittedPath := strings.Split(pattern, "/"), strings.Split(path, "/")
	params := Params{}
	for index, splittedPattern := range splittedPattern {
		if splittedPattern[0] == ':' {
			params[splittedPattern[1:]] = splittedPath[index]
		}
	}
	return params
}

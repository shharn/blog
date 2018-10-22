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

	params := Params{}
	splittedPattern, splittedPath := strings.Split(pattern, "/"), strings.Split(path, "/")
	for index, splittedPattern := range splittedPattern {
		if len(splittedPattern) > 0 && splittedPattern[0] == ':' {
			params[splittedPattern[1:]] = splittedPath[index]
		}
	}
	return params
}

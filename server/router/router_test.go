package router

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestMatchPathToPattern(t *testing.T) {
	tcs := []struct {
		pattern string
		path string
		expected bool
	}{
		{"/", "/", true},
		{"/", "", false},
		{"/", "/a", false},
		{"/", "a", false},
		{"/asdf", "/asd", false},
		{"/asdf", "/asdf", true},
		{"/asdf", "/asdfa", false},
		{"/:param1/ad", "/ad/ad", true},
		{"/:param1/ad", "//ad", true},
		{"/:param1/ad", "/11/ad", true},
		{"/:param1/ad", "/aa/ada", false},
		{"/:param1/ad/:param2", "/aa/ad/aa", true},
		{"/:param1/ad/:param2", "/aa/ada/asdf", false},
		{"/:param1/ad/:param2", "/aa/ad", false},
	}

	for _, tc := range tcs {
		actual := MatchPathToPattern(tc.pattern, tc.path)
		assert.Equal(t, tc.expected, actual)
	}
}
package handler

import (
	"net/url"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestSanitizeQueryParamOf(t *testing.T) {
	tcs := []struct{
		qps url.Values
		key string
		defVal string
		expected string
	}{
		{url.Values{}, "key", "3", "3"},
		{url.Values{"key":[]string{}}, "key", "3", "3"},
		{url.Values{"key2":[]string{"1","2"}}, "key", "10", "10"},
		{url.Values{"key":[]string{"2"}}, "key", "5", "2"},
		{url.Values{"key":[]string{"2"}}, "key", "2", "2"},
		{url.Values{"key":[]string{"2","3"}}, "key", "3", "2"},
		{url.Values{"key":[]string{"2"}, "key2":[]string{"5"}}, "key2", "2", "5"},
	}

	for _, tc := range tcs {
		actual := sanitizeQueryParamOf(tc.qps, tc.key, tc.defVal)
		assert.Equal(t, tc.expected, actual)
	}
}
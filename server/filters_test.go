package main

import (
	"fmt"
	"testing"
	"net/http"
	"net/http/httptest"

	"github.com/shharn/blog/router"
	"github.com/stretchr/testify/assert"
)

type expectedFilterResponse struct {
	pass bool
	errRes router.ErrorResponse
}

func trueFunc(w http.ResponseWriter, rq *http.Request) bool {
	return true
}

func falseFunc(w http.ResponseWriter, rq *http.Request) bool {
	return false
}

func TestIsTargetOfAuthFilter(t *testing.T) {
	af := AuthFilter{
		TargetContexts: []*TargetContext {
			0: &TargetContext{"/test", "POST", falseFunc},
			1: &TargetContext{"/test/:id", "PATCH", falseFunc},
			2: &TargetContext{"/", "POST", falseFunc},
			3: &TargetContext{"/", "DELETE", falseFunc},
		},
	}

	tcs := []struct {
		path string
		method string
		expected expectedFilterResponse
	}{
		{"/test", "POST", expectedFilterResponse{false, router.NewErrorResponse(http.StatusUnauthorized, "Unauthorized request")}},
		{"/test", "GET", expectedFilterResponse{true, router.EmptyErrorResponse}},
		{"/test", "PATCH", expectedFilterResponse{true, router.EmptyErrorResponse}},
		{"/test/11", "PATCH", expectedFilterResponse{false, router.NewErrorResponse(http.StatusUnauthorized, "Unauthorized request")}},
		{"/test/11", "GET", expectedFilterResponse{true, router.EmptyErrorResponse}},
		{"/test/11", "DELETE", expectedFilterResponse{true, router.EmptyErrorResponse}},
		{"/", "POST", expectedFilterResponse{false, router.NewErrorResponse(http.StatusUnauthorized, "Unauthorized request")}},
		{"/", "DELETE", expectedFilterResponse{false, router.NewErrorResponse(http.StatusUnauthorized, "Unauthorized request")}},
		{"/", "PATCH", expectedFilterResponse{true, router.EmptyErrorResponse}},
	}

	for _, tc := range tcs {
		rq := httptest.NewRequest(tc.method, fmt.Sprintf("http://test.com%s", tc.path), nil)
		res := httptest.NewRecorder()
		pass, errRes := af.Filter(res, rq)
		assert.Equal(t, tc.expected.pass, pass)
		assert.Equal(t, tc.expected.errRes, errRes)
	}
}
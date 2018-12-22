package router

import (
	"time"
	"math/rand"
	"net/http"
	"testing"

	"github.com/stretchr/testify/assert"
)

var httpMethods []string = []string{
	0: "GET",
	1: "PATCH",
	2: "PUT",
	3: "DELETE",
}
var testHttpMethodCount = len(httpMethods)
var mockServerHost = "http://server.com"
var randomNumberGenerator = rand.New(rand.NewSource(time.Now().UnixNano()))

func TestGetOriginFromRequest(t *testing.T) {
	testOrigins := []string{
		0:  "",
		1: "http://origin.com",
		2: "https://origin.com",
	}
	expecteds := []string {
		0: "",
		1: "origin.com",
		2: "origin.com",
	}
	for i, origin := range testOrigins {
		expected := expecteds[i]
		rq := makeMockRequestWithOrigin(origin)
		actual := getOriginFromRequest(rq)
		assert.Equal(t, expected, actual)
	}
}

func makeMockRequestWithOrigin(origin string) *http.Request{
	method := httpMethods[randomNumberGenerator.Intn(testHttpMethodCount)]
	req, _ := http.NewRequest(method, mockServerHost, nil)
	req.Header.Set("Origin", origin)
	return req
}
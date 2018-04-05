package server

import (
	"puppyloper.blog/server/router"
)

var (
	// Routers select the right handler
	Routers = router.Router{
		"GET":    router.RouterContext{},
		"POST":   router.RouterContext{},
		"PUT":    router.RouterContext{},
		"PATCH":  router.RouterContext{},
		"DELETE": router.RouterContext{},
	}
)

package repository

import (
	"github.com/shharn/blog/db"
)

type dgraphRepositoryContext struct {
	Client *db.Client
	Err error
}

func (c *dgraphRepositoryContext) Commit() {
	c.Client.Commit()
}

func (c *dgraphRepositoryContext) Rollback() {
	c.Client.Rollback()
}

func (c *dgraphRepositoryContext) Dispose() {
	defer c.Client.Dispose()
	if c.Err == nil {
		c.Commit()
	} else {
		c.Rollback()
	}
}
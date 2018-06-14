package db

import (
	"context"
	"encoding/json"

	"github.com/dgraph-io/dgo"
	"github.com/dgraph-io/dgo/protos/api"
	"github.com/pkg/errors"
	"google.golang.org/grpc"
)

const (
	dgraphAddress = "172.18.0.3:9080"
)

// MutationData represents a struct to execute multiple mutation at a single network request
type MutationData []interface{}

// Client is wrapper object for easy operation between application and dgraph
type Client struct {
	conn *grpc.ClientConn
	tx   *dgo.Txn
	ctx  context.Context
}

// Init make a underlying resources
func Init() (*Client, error) {
	c := &Client{}
	conn, err := grpc.Dial(dgraphAddress, grpc.WithInsecure())
	if err != nil {
		return nil, errors.New(err.Error())
	}
	dc := api.NewDgraphClient(conn)
	dg := dgo.NewDgraphClient(dc)
	c.tx, c.ctx = dg.NewTxn(), context.Background()
	c.conn = conn
	return c, nil
}

// Query sends a request for query without vars
func (c *Client) Query(q string) (*api.Response, error) {
	res, err := c.tx.Query(c.ctx, q)
	if err != nil {
		return nil, errors.New(err.Error())
	}
	return res, nil
}

// QueryWithVars sends a request for query with vars
func (c *Client) QueryWithVars(q string, vars map[string]string) (*api.Response, error) {
	res, err := c.tx.QueryWithVars(c.ctx, q, vars)
	if err != nil {
		return nil, errors.New(err.Error())
	}
	return res, nil
}

// Mutate sends a request for more than one mutation tasks
func (c *Client) Mutate(md MutationData) (*api.Assigned, error) {
	mu := &api.Mutation{}
	mmd, err := json.Marshal(md)
	if err != nil {
		return nil, errors.New(err.Error())
	}
	mu.SetJson = mmd
	assigned, err := c.tx.Mutate(c.ctx, mu)
	if err != nil {
		return nil, errors.New(err.Error())
	}
	return assigned, nil
}

// DeleteNode sends a request for a single task which deletes a node
func (c *Client) DeleteNode(uid string) (*api.Assigned, error) {
	d := map[string]string{"uid": uid}
	md, err := json.Marshal(d)
	if err != nil {
		return nil, errors.New(err.Error())
	}

	mu := &api.Mutation{
		DeleteJson: md,
	}

	res, err := c.tx.Mutate(c.ctx, mu)
	if err != nil {
		return nil, errors.New(err.Error())
	}
	return res, nil
}

// DeleteEdge sends a request for a single task which deletes a edge between nodes
func (c *Client) DeleteEdge(data interface{}) (*api.Assigned, error) {
	dd, err := json.Marshal(data)
	if err != nil {
		return nil, errors.New(err.Error())
	}
	mu := &api.Mutation{
		DeleteJson: dd,
	}
	res, err := c.tx.Mutate(c.ctx, mu)
	if err != nil {
		return nil, errors.New(err.Error())
	}
	return res, nil
}

// Delete makes a request for multiple tasks at once
func (c *Client) Delete(md MutationData) (*api.Assigned, error) {
	dd, err := json.Marshal(md)
	if err != nil {
		return nil, errors.New(err.Error())
	}
	mu := &api.Mutation{
		DeleteJson: dd,
	}
	res, err := c.tx.Mutate(c.ctx, mu)
	if err != nil {
		return nil, errors.New(err.Error())
	}
	return res, nil
}

// Commit DOES commit the transaction
func (c *Client) Commit() error {
	defer c.tx.Discard(c.ctx)
	if err := c.tx.Commit(c.ctx); err != nil {
		return errors.New(err.Error())
	}
	return nil
}

// CleanUp releases the underlying resources
func (c *Client) CleanUp() error {
	if c == nil {
		return nil
	}

	if err := c.conn.Close(); err != nil {
		return errors.New(err.Error())
	}
	return nil
}

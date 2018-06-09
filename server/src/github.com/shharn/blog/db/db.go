package db

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/dgraph-io/dgo"
	"github.com/dgraph-io/dgo/protos/api"
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
		return nil, err
	}
	dc := api.NewDgraphClient(conn)
	dg := dgo.NewDgraphClient(dc)
	c.tx, c.ctx = dg.NewTxn(), context.Background()
	c.conn = conn
	return c, nil
}

// Query sends a request for query without vars
func (c *Client) Query(q string) (*api.Response, error) {
	return c.tx.Query(c.ctx, q)
}

// QueryWithVars sends a request for query with vars
func (c *Client) QueryWithVars(q string, vars map[string]string) (*api.Response, error) {
	return c.tx.QueryWithVars(c.ctx, q, vars)
}

// MutateDeprecated will be removed
func (c *Client) MutateDeprecated(data interface{}) (*api.Assigned, error) {
	mu := &api.Mutation{}
	mmd, err := json.Marshal(data)
	if err != nil {
		return nil, err
	}
	fmt.Printf("Json string : %v\n", string(mmd))
	mu.SetJson = mmd
	return c.tx.Mutate(c.ctx, mu)
}

// Mutate sends a request for more than one mutation tasks
func (c *Client) Mutate(md MutationData) (*api.Assigned, error) {
	mu := &api.Mutation{}
	mmd, err := json.Marshal(md)
	fmt.Printf("Json string : %v\n", string(mmd))
	if err != nil {
		return nil, err
	}
	mu.SetJson = mmd
	assigned, err := c.tx.Mutate(c.ctx, mu)
	if err != nil {
		return nil, err
	}
	return assigned, nil
}

// DeleteNode sends a request for a single task which deletes a node
func (c *Client) DeleteNode(uid string) (*api.Assigned, error) {
	d := map[string]string{"uid": uid}
	md, err := json.Marshal(d)
	if err != nil {
		return nil, err
	}

	mu := &api.Mutation{
		DeleteJson: md,
	}
	return c.tx.Mutate(c.ctx, mu)
}

// DeleteEdge sends a request for a single task which deletes a edge between nodes
func (c *Client) DeleteEdge(data interface{}) (*api.Assigned, error) {
	dd, err := json.Marshal(data)
	if err != nil {
		return nil, err
	}
	mu := &api.Mutation{
		DeleteJson: dd,
	}
	return c.tx.Mutate(c.ctx, mu)
}

// Delete makes a request for multiple tasks at once
func (c *Client) Delete(md MutationData) (*api.Assigned, error) {
	dd, err := json.Marshal(md)
	fmt.Println("[DeleteTheMultiple] JSONT string : " + string(dd))
	if err != nil {
		return nil, err
	}
	mu := &api.Mutation{
		DeleteJson: dd,
	}
	return c.tx.Mutate(c.ctx, mu)
}

// Commit DOES commit the transaction
func (c *Client) Commit() error {
	defer c.tx.Discard(c.ctx)
	return c.tx.Commit(c.ctx)
}

// CleanUp releases the underlying resources
func (c *Client) CleanUp() error {
	return c.conn.Close()
}

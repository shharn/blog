package db

import (
	"context"
	"encoding/json"
	"log"

	"github.com/dgraph-io/dgo"
	"github.com/dgraph-io/dgo/protos/api"
	"github.com/pkg/errors"
	"google.golang.org/grpc"
)

var (
	dgraphAddress = "dgraph-server:9080"
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
		return nil, errors.WithStack(err)
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
		return nil, errors.WithStack(err)
	}
	return res, nil
}

// QueryWithVars sends a request for query with vars
func (c *Client) QueryWithVars(q string, vars map[string]string) (*api.Response, error) {
	res, err := c.tx.QueryWithVars(c.ctx, q, vars)
	if err != nil {
		return nil, errors.WithStack(err)
	}
	return res, nil
}

// Mutate sends a request for more than one mutation tasks
func (c *Client) Mutate(md MutationData) (*api.Assigned, error) {
	mu := &api.Mutation{}
	mmd, err := json.Marshal(md)
	if err != nil {
		return nil, errors.WithStack(err)
	}
	mu.SetJson = mmd
	assigned, err := c.tx.Mutate(c.ctx, mu)
	if err != nil {
		return nil, errors.WithStack(err)
	}
	return assigned, nil
}

// AddEdge sends a request for adding a edge between the nodes
func (c *Client) AddEdge(subject, predicate, objID string) (*api.Assigned, error) {
	mu := &api.Mutation{}
	mu.Set = append(mu.Set, &api.NQuad{
		Subject:   subject,
		Predicate: predicate,
		ObjectId:  objID,
	})

	res, err := c.tx.Mutate(c.ctx, mu)
	log.Printf("[AddEdge] res : %v\n", res)
	if err != nil {
		return nil, errors.WithStack(err)
	}
	return res, nil
}

// DeleteNode sends a request for a single task which deletes a node
func (c *Client) DeleteNode(uid string) (*api.Assigned, error) {
	d := map[string]string{"uid": uid}
	md, err := json.Marshal(d)
	if err != nil {
		return nil, errors.WithStack(err)
	}

	mu := &api.Mutation{
		DeleteJson: md,
	}

	res, err := c.tx.Mutate(c.ctx, mu)
	if err != nil {
		return nil, errors.WithStack(err)
	}
	return res, nil
}

// DeleteEdge sends a request for a single task which deletes a edge between the nodes
func (c *Client) DeleteEdge(subject, predicate, objValue string) (*api.Assigned, error) {
	mu := &api.Mutation{}
	mu.Del = append(mu.Del, &api.NQuad{
		Subject:   subject,
		Predicate: predicate,
		ObjectId:  objValue,
	})
	res, err := c.tx.Mutate(c.ctx, mu)
	if err != nil {
		return nil, errors.WithStack(err)
	}
	return res, nil
}

// Delete makes a request for multiple tasks at once
func (c *Client) Delete(md MutationData) (*api.Assigned, error) {
	log.Printf("[Delete] %v\n", md)
	dd, err := json.Marshal(md)
	if err != nil {
		return nil, errors.WithStack(err)
	}
	mu := &api.Mutation{
		DeleteJson: dd,
	}
	res, err := c.tx.Mutate(c.ctx, mu)
	if err != nil {
		return nil, errors.WithStack(err)
	}
	return res, nil
}

// func (c *Client) DeleteEdgeWithNQuads(id, predicate, edgeID string) (*api.Assigned, error) {
// 	mu.Del = append(mu.Del, &api.NQuad{
// 		Subject:   uid,
// 		Predicate: predicate,
// 		// _STAR_ALL is defined as x.Star in x package.
// 		ObjectValue: &api.Value{&api.Value_DefaultVal{"_STAR_ALL"}},
// 	})
// }

// Commit DOES commit the transaction
func (c *Client) Commit() error {
	defer c.tx.Discard(c.ctx)
	if err := c.tx.Commit(c.ctx); err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// CleanUp releases the underlying resources
func (c *Client) CleanUp() error {
	if c == nil {
		return nil
	}

	if err := c.conn.Close(); err != nil {
		return errors.WithStack(err)
	}
	return nil
}

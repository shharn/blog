package db

import (
	"context"
	"encoding/json"
	"errors"
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
	conn     *grpc.ClientConn
	tx       *dgo.Txn
	ctx      context.Context
	Response interface{}
	Error    error
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
func (c *Client) Query(q string) *api.Response {
	if c.Error != nil {
		return nil
	}
	res, err := c.tx.Query(c.ctx, q)
	c.Error = err
	return res
}

// QueryWithVars sends a request for query with vars
func (c *Client) QueryWithVars(q string, vars map[string]string) *api.Response {
	if c.Error != nil {
		return nil
	}
	res, err := c.tx.QueryWithVars(c.ctx, q, vars)
	c.Error = err
	return res
}

// Mutate sends a request for a single mutation task
func (c *Client) Mutate(data interface{}) *api.Assigned {
	if c.Error != nil {
		return nil
	}

	mu := &api.Mutation{}
	mmd, err := json.Marshal(data)
	if err != nil {
		c.Error = err
		return nil
	}
	fmt.Printf("Json string : %v\n", string(mmd))
	mu.SetJson = mmd
	res, err := c.tx.Mutate(c.ctx, mu)
	c.Error = err
	return res
}

// MutateTheMultiple sends a request for more than one mutation tasks
func (c *Client) MutateTheMultiple(md MutationData) *api.Assigned {
	mu := &api.Mutation{}
	mmd, err := json.Marshal(md)
	fmt.Printf("Json string : %v\n", string(mmd))
	if err != nil {
		c.Error = err
		return nil
	}
	mu.SetJson = mmd
	assigned, err := c.tx.Mutate(c.ctx, mu)
	if err != nil {
		c.Error = err
		return nil
	}
	fmt.Println(assigned)
	return assigned
}

// DeleteNode sends a request for a single task which deletes a node
func (c *Client) DeleteNode(uid string) *api.Assigned {
	if c.Error != nil {
		return nil
	}

	d := map[string]string{"uid": uid}
	md, err := json.Marshal(d)
	if err != nil {
		c.Error = err
		return nil
	}

	mu := &api.Mutation{
		DeleteJson: md,
	}
	res, err := c.tx.Mutate(c.ctx, mu)
	c.Error = err
	return res
}

// DeleteEdge sends a request for a single task which deletes a edge between nodes
func (c *Client) DeleteEdge(data interface{}) *api.Assigned {
	if c.Error != nil {
		return nil
	}

	dd, err := json.Marshal(data)
	if err != nil {
		c.Error = err
		return nil
	}
	mu := &api.Mutation{
		DeleteJson: dd,
	}
	res, err := c.tx.Mutate(c.ctx, mu)
	c.Error = err
	return res
}

// DeleteTheMultiple makes a request for multiple tasks at once
func (c *Client) DeleteTheMultiple(md MutationData) *api.Assigned {
	if c.Error != nil {
		return nil
	}
	dd, err := json.Marshal(md)
	fmt.Println("[DeleteTheMultiple] JSONT string : " + string(dd))
	if err != nil {
		c.Error = err
		return nil
	}
	mu := &api.Mutation{
		DeleteJson: dd,
	}
	res, err := c.tx.Mutate(c.ctx, mu)
	c.Error = err
	return res
}

// Commit DOES commit the transaction
func (c *Client) Commit() error {
	defer c.tx.Discard(c.ctx)
	return c.tx.Commit(c.ctx)
}

// CleanUp releases the underlying resources
func (c *Client) CleanUp() {
	c.conn.Close()
}

//////////////////////////////////////////////////////////////////////////////////////////
// old version ... will be removed
type subFunc func(*dgo.Txn, context.Context) (interface{}, error)

func base(fn subFunc) (interface{}, error) {
	conn, err := grpc.Dial(dgraphAddress, grpc.WithInsecure())
	if err != nil {
		return nil, err
	}
	defer conn.Close()
	dc := api.NewDgraphClient(conn)
	dg := dgo.NewDgraphClient(dc)
	tx, ctx := dg.NewTxn(), context.Background()
	defer tx.Discard(ctx)
	return fn(tx, ctx)
}

// QueryData send a request for querying to dgraph server
func QueryData(q string, vars map[string]string) (*api.Response, error) {
	querySubFunc := func(tx *dgo.Txn, ctx context.Context) (interface{}, error) {
		var (
			res *api.Response
			err error
		)
		if vars != nil && len(vars) > 0 {
			res, err = tx.QueryWithVars(ctx, q, vars)
		} else {
			res, err = tx.Query(ctx, q)
		}
		return res, err
	}
	resp, err := base(querySubFunc)
	return resp.(*api.Response), err
}

// MutateData will be deprecated
func MutateData(md MutationData) (*api.Assigned, error) {
	fmt.Printf("[MutateData] data - %v\n", md)
	mutationSubFunc := func(tx *dgo.Txn, ctx context.Context) (interface{}, error) {
		mu := &api.Mutation{}
		mmd, err := json.Marshal(md)
		fmt.Printf("Json string : %v\n", string(mmd))
		if err != nil {
			return nil, errors.New("Unable to marshal data.\nReason : " + err.Error())
		}
		mu.SetJson = mmd
		return tx.Mutate(ctx, mu)
	}
	resp, err := base(mutationSubFunc)
	return resp.(*api.Assigned), err
}

// DeleteData send a request for deletion to dgraph server
func DeleteData(uid string) (*api.Assigned, error) {
	deleteSubFunc := func(tx *dgo.Txn, ctx context.Context) (interface{}, error) {
		d := map[string]string{"uid": uid}
		md, err := json.Marshal(d)
		if err != nil {
			return nil, err
		}
		mu := &api.Mutation{
			DeleteJson: md,
		}
		return tx.Mutate(ctx, mu)
	}
	resp, err := base(deleteSubFunc)
	return resp.(*api.Assigned), err
}

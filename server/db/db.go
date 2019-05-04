package db

import (
	"context"
	"encoding/json"

	"github.com/dgraph-io/dgo"
	"github.com/dgraph-io/dgo/protos/api"
	"github.com/pkg/errors"
	"github.com/shharn/blog/logger"
	"google.golang.org/grpc"
)

var (
	dgraphAddress = "dgraph-server-service:9080"
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
	logger.WithFields(logger.Tuples{
		"query": q,
	})("trace", "db.Client.Query")
	res, err := c.tx.Query(c.ctx, q)
	if err != nil {
		return nil, errors.WithStack(err)
	}
	return res, nil
}

// QueryWithVars sends a request for query with vars
func (c *Client) QueryWithVars(q string, vars map[string]string) (*api.Response, error) {
	logger.WithFields(logger.Tuples{
		"query": q,
		"vars": vars,
	})("trace", "db.Client.QueryWithVars")
	res, err := c.tx.QueryWithVars(c.ctx, q, vars)
	if err != nil {
		return nil, errors.WithStack(err)
	}
	return res, nil
}

// Mutate sends a request for more than one mutation tasks
func (c *Client) Mutate(md MutationData) (*api.Assigned, error) {
	logger.WithFields(logger.Tuples{
		"mutation_data": md,
	})("trace", "db.Client.Mutate")
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

// MutateWithNquad mutates with NQuad
func (c *Client) MutateWithNquad(subject, predicate string, objectValue interface{}) (*api.Assigned, error) {
	logger.WithFields(logger.Tuples{
		"subject": subject,
		"predicate": predicate,
		"objectValue": objectValue,
	})("trace", "db.Client.MutateWithNQuad")
	val := &api.Value{}
	switch v := objectValue.(type) {
	case int:
		val.Val = &api.Value_IntVal{IntVal: int64(v)}
	case int64:
		val.Val = &api.Value_IntVal{IntVal: v}
	case bool:
		val.Val = &api.Value_BoolVal{BoolVal: v}
	case string:
		val.Val = &api.Value_StrVal{StrVal: v}
	default:
		if strVal, ok := v.(string); ok {
			val.Val = &api.Value_StrVal{StrVal: strVal}
		} else {
			return nil, errors.New("Cannot convert unsupported type to string")
		}
	}
	mu := &api.Mutation{}
	mu.Set = append(mu.Set, &api.NQuad{
		Subject: subject,
		Predicate: predicate,
		ObjectValue: val,
	})

	if res, err := c.tx.Mutate(c.ctx, mu); err == nil {
		return res, nil
	} else {
		return nil, errors.WithStack(err)
	}
}

// AddEdge sends a request for adding a edge between the nodes
func (c *Client) AddEdge(subject, predicate, objID string) (*api.Assigned, error) {
	logger.WithFields(logger.Tuples{
		"subject": subject,
		"predicate": predicate,
		"object_id": objID,
	})("trace", "db.Client.AddEdge")
	mu := &api.Mutation{}
	mu.Set = append(mu.Set, &api.NQuad{
		Subject:   subject,
		Predicate: predicate,
		ObjectId:  objID,
	})

	res, err := c.tx.Mutate(c.ctx, mu)
	if err != nil {
		return nil, errors.WithStack(err)
	}
	return res, nil
}

// DeleteNode sends a request for a single task which deletes a node
func (c *Client) DeleteNode(uid string) (*api.Assigned, error) {
	logger.WithFields(logger.Tuples{
		"uid": uid,
	})("trace", "db.Client.DeleteNode")
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
	logger.WithFields(logger.Tuples{
		"subject": subject,
		"predicate": predicate,
		"object_id": objValue,
	})("trace", "db.Client.DeleteEdge")
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
	logger.WithFields(logger.Tuples{
		"mutation_data": md,
	})("trace", "db.Client.Delete")
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

// Commit DOES commit the transaction
func (c *Client) Commit() {
	if err := c.tx.Commit(c.ctx); err != nil {
		err = errors.WithStack(err)
		logger.Error(err)
	}
}

func (c *Client) Discard() {
	c.tx.Discard(c.ctx)
}

// CleanUp releases the underlying resources
func (c *Client) CleanUp() {
	if c != nil {
		if err := c.conn.Close(); err != nil {
			err = errors.WithStack(err)
			logger.Error(err)
		}
	}
}

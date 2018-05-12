package db

import (
	"context"
	"encoding/json"
	"errors"
	"strconv"

	"github.com/dgraph-io/dgo"
	"github.com/dgraph-io/dgo/protos/api"
	"google.golang.org/grpc"
)

type subFunc func(*dgo.Txn, context.Context) (interface{}, error)

const (
	dgraphAddress = "localhost:9080"
)

func base(fn subFunc) (interface{}, error) {
	conn, err := grpc.Dial(dgraphAddress, grpc.WithInsecure())
	if err != nil {
		return nil, err
	}
	defer conn.Close()
	dc := api.NewDgraphClient(conn)
	dg := dgo.NewDgraphClient(dc)
	tx, ctx := dg.NewTxn(), context.Background()
	tx.Discard(ctx)
	return fn(tx, ctx)
}

// QueryData send a request for querying to dgraph server
func QueryData(q string, vars map[string]string) (res interface{}, err error) {
	querySubFunc := func(tx *dgo.Txn, ctx context.Context) (interface{}, error) {
		if len(vars) > 0 {
			res, err = tx.QueryWithVars(ctx, q, vars)
		} else {
			res, err = tx.Query(ctx, q)
		}
		return res, err
	}
	return base(querySubFunc)
}

// MutateData send a request for mutation to dgraph server
func MutateData(data interface{}) (interface{}, error) {
	mutationSubFunc := func(tx *dgo.Txn, ctx context.Context) (interface{}, error) {
		mu := &api.Mutation{
			CommitNow: true,
		}
		md, err := json.Marshal(data)
		if err != nil {
			return nil, errors.New("Unable to marshal data.\nReason : " + err.Error())
		}
		mu.SetJson = md
		return tx.Mutate(ctx, mu)
	}
	return base(mutationSubFunc)
}

// DeleteData send a request for deletion to dgraph server
func DeleteData(uid int) (interface{}, error) {
	deleteSubFunc := func(tx *dgo.Txn, ctx context.Context) (interface{}, error) {
		d := map[string]string{"uid": strconv.Itoa(uid)}
		md, err := json.Marshal(d)
		if err != nil {
			return nil, err
		}
		mu := &api.Mutation{
			CommitNow:  true,
			DeleteJson: md,
		}
		return tx.Mutate(ctx, mu)
	}
	return base(deleteSubFunc)
}

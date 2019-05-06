package repository

import (
	"encoding/json"

	"github.com/pkg/errors"
	"github.com/shharn/blog/db"
)

type AuthenticationRepository interface {
	Authenticate(interface{}, string, string) (bool, error)
	Contextual
}

const (
	authenticationQuery = `
		query authenticate($email: string, $pswd: string) {
			result (func: eq(email, $email)) {
				isValid: checkpwd(pswd, $pswd)
			}
		}
	`
)

type authenticationPayload struct {
	Result []authenticationResult `json:"result,omitempty"`
}

type authenticationResult struct {
	IsValid bool `json:"isValid"`
}

type DgraphAuthenticationRepository struct {}

func (r *DgraphAuthenticationRepository) Context() interface{} {
	c, err := db.Init()
	if err != nil {
		panic(err)
	}
	return &dgraphRepositoryContext{c, nil}
}

func (r *DgraphAuthenticationRepository) Authenticate(ctx interface{}, email, password string) (bool, error) {
	rctx := ctx.(*dgraphRepositoryContext)
	vars := map[string]string{
		"$email": email,
		"$pswd": password,
	}
	
	res, err := rctx.Client.QueryWithVars(authenticationQuery, vars)
	if err != nil {
		rctx.Err = err
		return false, err
	}

	authResult := authenticationPayload{}
	if err := json.Unmarshal(res.Json, &authResult); err != nil {
		rctx.Err = err
		return false, errors.WithStack(err)
	}

	if len(authResult.Result) < 1 {
		return false, nil
	}
	return authResult.Result[0].IsValid, nil
}

func NewAuthenticationRepository() AuthenticationRepository {
	return &DgraphAuthenticationRepository{}
}

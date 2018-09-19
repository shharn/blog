package service

import (
	"encoding/json"

	"github.com/pkg/errors"
	"github.com/shharn/blog/db"
)

const (
	authenticationQuery = `
		query authenticate($email: string, $pswd: string) {
			result (func: eq(email, $email)) {
				checkpwd(pswd, $pswd)
			}
		}
	`
)

type authenticationPayload struct {
	Result []authenticationResult `json:"result,omitempty"`
}

type authenticationResult struct {
	Pswd []realResult `json:"pswd,omitempty"`
}

type realResult struct {
	Checkpwd bool `json:"checkpwd"`
}

// Authenticated receives email & password. Then check the parameters on Databse
// Dgraph server will throw the result
func Authenticate(email, password string) (bool, error) {
	var (
		err error
		c   *db.Client
	)
	c, err = db.Init()
	if err != nil {
		return false, err
	}
	defer c.CleanUp()

	vars := map[string]string{
		"$email": email,
		"$pswd": password,
	}
	
	res, err2 := c.QueryWithVars(authenticationQuery, vars)
	defer c.Commit()
	if err2 != nil {
		return false, err2
	}

	authResult := authenticationPayload{}
	if err = json.Unmarshal(res.Json, &authResult); err != nil {
		return false, errors.WithStack(err)
	}

	if len(authResult.Result) < 1 {
		return false, errors.New("Invalid email or password")
	}

	if authResult.Result[0].Pswd[0].Checkpwd {
		return true, nil
	} else {
		return false, errors.New("Invalid email or password")
	}
}
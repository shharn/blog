package session

import (
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/pkg/errors"
	"github.com/shharn/blog/data"
	"github.com/shharn/blog/logger"
)

type tokenManager struct {
	token *jwt.Token
	signedTokenString string
	keyManager *keyManager
}

func (tm *tokenManager) MakeToken(info *data.LoginInformation) {
	claims := make(jwt.MapClaims)
	claims["iat"] = time.Now().Unix()
	claims["email"] = info.Email
	tm.token = jwt.New(jwt.SigningMethodHS256)
	tm.token.Claims = claims
	
	if tempSigned, err := tm.token.SignedString(tm.keyManager.GetKey()); err == nil {
		tm.signedTokenString = tempSigned
	} else {
		wrappedError := errors.WithStack(err)
		logger.Logger.Fatal(wrappedError)
	}
}

func (tm *tokenManager) ValidateToken(clientToken string) bool {
	token, err := jwt.Parse(clientToken, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.Errorf("Unexpected signing method: %v", token.Header["alg"])
		}
		return tm.keyManager.GetKey(), nil
	})
	if err != nil {
		wrappedError := errors.WithStack(err)
		logger.Logger.Error(wrappedError)
		return false
	}
	return token.Valid
}

func (tm *tokenManager) GetSignedTokenString() string {
	return tm.signedTokenString
}

func (tm *tokenManager) RegenerateKey() {
	if err := tm.keyManager.GenerateKey(); err != nil {
		logger.Logger.Error(err)
	}
}

func newTokenManager() *tokenManager {
	instance := &tokenManager{
		keyManager: newKeyManager(),
	}
	return instance
}

var TokenManager = newTokenManager()
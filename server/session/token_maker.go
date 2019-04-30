package session

import (
	"os"
	"strings"
	"sync"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/pkg/errors"
	"github.com/shharn/blog/model"
)

const (
	adminPictureURL = "https://storage.googleapis.com/puppyloper-blog/images/me_icon_2_50x50.png"
	adminName = "Seunghwan Han"

	OAuthPlatformNative = "native"
	OAuthPlatformGoogle = "google"
	OAuthPlatformFacebook = "facebook"
	OAuthPlatformGithub = "github"
)

var (
	SupportedOAuthPlatforms =[]string{ OAuthPlatformGoogle, OAuthPlatformFacebook, OAuthPlatformGithub }

	invalidEmailInput = errors.New("Invalid email formatted input. Should contains ID, at least")
)

// Session contains the user-specific information
type Session struct {
	ID string
	Name string
	PictureURL string
	Platform string
	CreatedAt time.Time
	ExpiredAt time.Time
	Admin bool
}

func GetSessionFromLoginInformation(info model.LoginInformation) (Session, error) {
	id := getIDFromEmail(info.Email)
	if len(id) < 1 {
		return Session{}, invalidEmailInput
	}
	return Session{
		ID: id,
		Name: adminName,
		PictureURL: adminPictureURL,
		Platform: OAuthPlatformNative,
		CreatedAt: time.Now(),
		Admin: true,
	}, nil
}

func getIDFromEmail(email string) string {
	splitted := strings.SplitN(email, "@", 2)
	if len(splitted) < 1 {
		return ""
	}
	return splitted[0]
}

var (
	issuer = "puppyloper :)"
	tokenMakerOnce sync.Once
	jwtSecretKeyEnvName = "JWT_SECRET"
	tmInstance TokenMaker
)

type TokenMaker interface {
	Encode(interface{}) (string, error)
	Decode(string) (interface{}, error)
}

type JWTTokenMaker struct {}

func (e JWTTokenMaker) Encode(v interface{}) (string, error) {
	params, ok := v.(Session)
	if !ok {
		return "", errors.New("Cannot convert input of JWTTokenMaker.Encode to LoginInformation")
	}
	claims, err := e.makeClaims(params)
	if err != nil {
		return "", err
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	secret := []byte(os.Getenv(jwtSecretKeyEnvName))
	tokenString, err := token.SignedString(secret);
	if err != nil {
		return "", err
	}
	return tokenString, nil
}

func (e JWTTokenMaker) sessionFromClaims(claims jwt.MapClaims) *Session {
	var (
		rawCreated int64
		rawExpired int64
	)

	switch v := claims["iat"].(type) {
	case int64:
		rawCreated = v
	case float64:
		rawCreated = int64(v)
	}

	switch v := claims["exp"].(type) {
	case int64:
		rawExpired = v
	case float64:
		rawExpired = int64(v)
	}

	created := time.Unix(rawCreated, 0)
	expired := time.Unix(rawExpired, 0)
	session := &Session{
		ID: claims["id"].(string),
		Name: claims["name"].(string),
		PictureURL: claims["pictureURL"].(string),
		Platform: claims["platform"].(string),
		CreatedAt: created,
		ExpiredAt: expired,
		Admin: claims["admin"].(bool),
	}
	return session
}

func (e JWTTokenMaker) makeClaims(input Session) (jwt.MapClaims, error) {
	claims := make(jwt.MapClaims)
	if len(input.ID) < 1 || len(input.Name) < 1 || len(input.Platform) < 1 || input.CreatedAt.IsZero() {
		return jwt.MapClaims{}, errors.Errorf("Input has empty properties. %v", input)
	}
	claims["id"] = input.ID
	claims["name"] = input.Name
	claims["pictureURL"] = input.PictureURL
	claims["platform"] = input.Platform
	claims["iat"] = input.CreatedAt.Unix()
	claims["exp"] = input.CreatedAt.Add(time.Hour * 2).Unix()
	claims["iss"] = issuer
	claims["admin"] = input.Admin

	return claims, nil
}

func (e JWTTokenMaker) Decode(tokenString string) (interface{}, error) {
	token, err := jwt.Parse(tokenString, func (token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.Errorf("Unexpected signing method : %v", token.Header["alg"])
		}
		return []byte(os.Getenv(jwtSecretKeyEnvName)), nil
	})

	if err != nil {
		return nil, err
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		session := e.sessionFromClaims(claims)
		return session, nil
	}
	return nil, errors.Errorf("Invalid token found : %v", tokenString)
}

func BlogTokenMaker() TokenMaker {
	tokenMakerOnce.Do(func () {
		tmInstance = &JWTTokenMaker{}
	})
	return tmInstance
}

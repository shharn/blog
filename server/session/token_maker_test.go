package session

import (
	"fmt"
	"os"
	"testing"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/shharn/blog/model"
	"github.com/stretchr/testify/assert"
)

func TestBlogTokenMakerOfSingleton(t *testing.T) {
	b1 := BlogTokenMaker()
	b2 := BlogTokenMaker()
	b3 := BlogTokenMaker()

	assert.Equal(t, b1, b2)
	assert.Equal(t, b2, b3)
	assert.Equal(t, b1, b3)
}

func TestBlogTokenMakerOfMakeClaims(t *testing.T) {
	b, ok := BlogTokenMaker().(*JWTTokenMaker)
	assert.True(t, ok)
	assert.NotNil(t, b)

	tm := time.Now()
	zt := time.Time{}
	tcs := []struct {
		in Session
		expected jwt.MapClaims
		hasError bool
	}{
		{Session{"", "", "", "", time.Time{}, zt, false}, jwt.MapClaims{}, true},
		{Session{"", "testname", "testpictureurl", "platform", tm, zt, true}, jwt.MapClaims{}, true},
		{Session{"testid", "testname", "", "platform", tm, zt, false}, makeMockJWTClaims("testid", "testname", "", "platform", tm, false), false},
		{Session{"testid","testname","testpictureurl","platform", tm, zt, true}, makeMockJWTClaims("testid", "testname", "testpictureurl", "platform", tm, true), false},
	}

	for _, tc := range tcs {
		c, err := b.makeClaims(tc.in)
		assert.Equal(t, tc.expected, c)
		assert.Equal(t, tc.hasError, err != nil)
	}
}

func TestBlogTokenMakerOfSessionFromClaims(t *testing.T) {
	b, ok := BlogTokenMaker().(*JWTTokenMaker)
	assert.True(t, ok)
	assert.NotNil(t, b)

	tm := time.Now()
	tcs := []struct {
		in jwt.MapClaims
		expected *Session
	}{
		{makeMockJWTClaims("aa", "bb", "", "platform", tm, false), &Session{"aa", "bb", "", "platform", tm, makeExpirationTime(tm), false}},
		{makeMockJWTClaims("aa", "bb", "cc", "platform", tm, true), &Session{"aa", "bb", "cc", "platform", tm, makeExpirationTime(tm), true}},
	}

	for _, tc := range tcs {
		s := b.sessionFromClaims(tc.in)
		assert.Equal(t, tc.expected.ID, s.ID)
		assert.Equal(t, tc.expected.Name, s.Name)
		assert.Equal(t, tc.expected.PictureURL, s.PictureURL)
		assert.Equal(t, tc.expected.CreatedAt.Unix(), s.CreatedAt.Unix())
		assert.Equal(t, tc.expected.ExpiredAt.Unix(), s.ExpiredAt.Unix())
		assert.Equal(t, tc.expected.Admin, s.Admin)
	}
}

func TestBlogTokenMakerOfEncode(t *testing.T) {
	b := BlogTokenMaker()
	assert.NotNil(t, b)

	tm, err := time.Parse(time.RFC3339, "2019-03-28T12:00:00.000+09:00")
	assert.Nil(t, err)
	assert.NotNil(t, tm)

	os.Setenv(jwtSecretKeyEnvName, "test_secret")

	tcs := []struct {
		in Session
		expected string
		hasError bool
	}{
		{Session{}, "", true},
		{Session{"id","name","url","platform", tm, tm, true}, "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbiI6dHJ1ZSwiZXhwIjoxNTUzNzQ5MjAwLCJpYXQiOjE1NTM3NDIwMDAsImlkIjoiaWQiLCJpc3MiOiJwdXBweWxvcGVyIDopIiwibmFtZSI6Im5hbWUiLCJwaWN0dXJlVVJMIjoidXJsIiwicGxhdGZvcm0iOiJwbGF0Zm9ybSJ9.6LXGxDap8qnWZdvEShyZMoTqYApIXc2ygC_Co6iqrRU",false},
	}

	for _, tc := range tcs {
		ts, err := b.Encode(tc.in)
		assert.Equal(t, tc.hasError, err != nil)
		assert.Equal(t, tc.expected, ts)
	}
}

func TestBlogTokenMakerOfDecode(t *testing.T) {
	b := BlogTokenMaker()
	assert.NotNil(t, b)

	now := time.Now()
	ms := Session{"id", "name", "url", "platform", now, now.Add(time.Hour * 2), true}
	mt, err := b.Encode(ms)
	assert.Nil(t, err)

	tcs := []struct {
		in string
		expected interface{}
		hasError bool
	}{
		{"asdf.fff.ffff", nil, true},
		{"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbiI6dHJ1ZSwiZXhwIjoxNTUzNzQ5MjAwLCJpYXQiOjE1NTM3NDIwMDAsImlkIjoiaWQiLCJpc3MiOiJwdXBweWxvcGVyIDopIiwibmFtZSI6Im5hbWUiLCJwaWN0dXJlVVJMIjoidXJsIiwicGxhdGZvcm0iOiJwbGF0Zm9ybSJ9.eW8Ps8ZWkhj2IGiRsgGgX6lYp9k2S1jhRe9XRbz8OQM", nil, true}, // expired token
		{mt,ms, false},
	}

	for _, tc := range tcs {
		ts, err := b.Decode(tc.in)
		assert.Equal(t, tc.hasError, err != nil, fmt.Sprintf("%+v", err))
		if err != nil || ts == nil {
			assert.Equal(t, tc.expected, ts)
		} else {
			session, ok1 := ts.(*Session)
			expectedSession, ok2 := tc.expected.(Session)
			assert.True(t, ok1)
			assert.True(t, ok2)

			assert.Equal(t, expectedSession.ID, session.ID)
			assert.Equal(t, expectedSession.Name, session.Name)
			assert.Equal(t, expectedSession.PictureURL, session.PictureURL)
			assert.Equal(t, expectedSession.CreatedAt.Unix(), session.CreatedAt.Unix())
			assert.Equal(t, expectedSession.ExpiredAt.Unix(), session.ExpiredAt.Unix())
			assert.Equal(t, expectedSession.Admin, session.Admin)
		}
	}
}

func TestGetIDFromEmail(t *testing.T) {
	tcs := []struct {
		in string
		expected string
	}{
		{"aaa", "aaa"},
		{"", ""},
		{"aaa@email.com", "aaa"},
		{"aaa@", "aaa"},
		{"@asdf", ""},
	}

	for _, tc := range tcs {
		actual := getIDFromEmail(tc.in)
		assert.Equal(t, tc.expected, actual)
	}
}

func TestGetSessionFromLoginInformation(t *testing.T) {
	tcs := []struct {
		in model.LoginInformation
		expected Session
		hasError bool
	}{
		{model.LoginInformation{"aaaa@asdf", "ff"}, Session{"aaaa", adminName, adminPictureURL,OAuthPlatformNative, time.Now(), time.Now(), true}, false},
		{model.LoginInformation{"", ""}, Session{}, true},
		{model.LoginInformation{"aaa", ""}, Session{"aaa", adminName,  adminPictureURL, OAuthPlatformNative, time.Now(), time.Now(), true}, false},
	}

	for _, tc := range tcs {
		actual, err := GetSessionFromLoginInformation(tc.in)
		assert.Equal(t, tc.hasError, err != nil)
		if !tc.hasError {
			assert.Equal(t, tc.expected.ID, actual.ID)
			assert.Equal(t, tc.expected.Name, actual.Name)
			assert.Equal(t, tc.expected.PictureURL, actual.PictureURL)
			assert.Equal(t, tc.expected.Admin, actual.Admin)
		}
	}
}

func makeMockJWTClaims(id, name, pu, platform string, createdAt time.Time, admin bool) jwt.MapClaims {
	c := jwt.MapClaims{}
	c["id"] = id
	c["name"] = name
	c["pictureURL"] = pu
	c["platform"] = platform
	c["iat"] = createdAt.Unix()
	c["exp"] = createdAt.Add(time.Hour * 2).Unix()
	c["iss"] = issuer
	c["admin"] = admin
	return c
}

func makeExpirationTime(t time.Time) time.Time {
	return t.Add(time.Hour * 2)
}
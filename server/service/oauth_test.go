package service

import (
	"testing"
	"time"

	"github.com/shharn/blog/session"
	"github.com/stretchr/testify/assert"
)

func TestUserInfoOfConvertToSession(t *testing.T) {
	tcs := []struct {
		in userInfo
		expected session.Session
	}{
		{userInfo{"", "", "", ""}, session.Session{"", "", "", "", time.Time{}, time.Time{}, false}},
		{userInfo{"", "name", "", "platform"}, session.Session{"", "name", "", "platform", time.Time{}, time.Time{}, false}},
		{userInfo{"id", "name", "pictureURL", "platform"}, session.Session{"id", "name", "pictureURL", "platform", time.Time{}, time.Time{}, false}},
	}

	for _, tc := range tcs {
		expected := tc.expected
		actual := tc.in.ToSession()
		assert.Equal(t, expected.ID, actual.ID)
		assert.Equal(t, expected.Name, actual.Name)
		assert.Equal(t, expected.PictureURL, actual.PictureURL)
		assert.Equal(t, expected.Platform, actual.Platform)
		assert.Equal(t, expected.Admin, actual.Admin)
	}
}

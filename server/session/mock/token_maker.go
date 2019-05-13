package mock

import (
	"github.com/stretchr/testify/mock"
)

type MockTokenMaker struct {
	mock.Mock
}

func (m *MockTokenMaker) Encode(in interface{}) (string, error) {
	ret := m.Called(in)
	return ret.String(0), ret.Error(1)
}

func (m *MockTokenMaker) Decode(token string) (interface{}, error) {
	ret := m.Called(token)
	return ret.Get(0), ret.Error(1)
}

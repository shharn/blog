package mock

import (
	"github.com/stretchr/testify/mock"
)

type MockSessionStorage struct {
	mock.Mock
}

func (m *MockSessionStorage) Put(val string) {
	m.Called(val)
}

func (m *MockSessionStorage) Has(key string) bool {
	ret := m.Called(key)
	return ret.Bool(0)
}

func (m *MockSessionStorage) Remove(key string) {
	m.Called(key)
}

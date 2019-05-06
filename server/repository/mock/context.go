package mock

import (
	"github.com/stretchr/testify/mock"
)

type MockContext struct {
	mock.Mock
}

func (mc *MockContext) Dispose() {
	mc.Called()
}
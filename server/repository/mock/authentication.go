package mock

import (
	"github.com/shharn/blog/repository"
	"github.com/stretchr/testify/mock"
)

type MockAuthenticationRepository struct {
	mock.Mock
}

func (mr *MockAuthenticationRepository) Context() interface{} {
	ret := mr.Called()
	return ret.Get(0).(repository.Disposable)
}

func (mr *MockAuthenticationRepository) Authenticate(ctx interface{}, email, password string) (bool, error) {
	ret := mr.Called(ctx, email, password)
	return ret.Bool(0), ret.Error(1)
}
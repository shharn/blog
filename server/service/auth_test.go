package service

import (
	"errors"
	"testing"

	repoMock "github.com/shharn/blog/repository/mock"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/suite"
)

type authenticateAdminTestSuite struct {
	suite.Suite
	mc *repoMock.MockContext
	mr *repoMock.MockAuthenticationRepository
}

func (suite *authenticateAdminTestSuite) SetupTest() {
	suite.mc = new(repoMock.MockContext)
	suite.mr = new(repoMock.MockAuthenticationRepository)
}

func (suite *authenticateAdminTestSuite) TestHappyPathWithCorrectEmailAndPassword() {
	mockEmail := "email@test.com"
	mockPassword := "password"
	svc := NewAuthenticationService(suite.mr)
	suite.mc.On("Dispose").Once()
	suite.mr.On("Context").Return(suite.mc).Once()
	suite.mr.On("Authenticate", suite.mc, mockEmail, mockPassword).Return(true, nil)

	valid := svc.AuthenticateAdmin(mockEmail, mockPassword)

	assert.True(suite.T(), valid)
	suite.mc.AssertExpectations(suite.T())
	suite.mr.AssertExpectations(suite.T())
}

func (suite *authenticateAdminTestSuite) TestHappyPathWithIncorrectEmailAndPassword() {
	mockEmail := "email@test.com"
	mockPassword := "password"
	svc := NewAuthenticationService(suite.mr)
	suite.mc.On("Dispose").Once()
	suite.mr.On("Context").Return(suite.mc).Once()
	suite.mr.On("Authenticate", suite.mc, mockEmail, mockPassword).Return(false, nil)

	valid := svc.AuthenticateAdmin(mockEmail, mockPassword)

	assert.False(suite.T(), valid)
	suite.mc.AssertExpectations(suite.T())
	suite.mr.AssertExpectations(suite.T())
}

func (suite *authenticateAdminTestSuite) TestWhenErrorFromRepository() {
	mockEmail := "email@test.com"
	mockPassword := "password"
	mockError := errors.New("mock error")
	svc := NewAuthenticationService(suite.mr)
	suite.mc.On("Dispose").Once()
	suite.mr.On("Context").Return(suite.mc).Once()
	suite.mr.On("Authenticate", suite.mc, mockEmail, mockPassword).Return(false, mockError)

	valid := svc.AuthenticateAdmin(mockEmail, mockPassword)

	assert.False(suite.T(), valid)
	suite.mc.AssertExpectations(suite.T())
	suite.mr.AssertExpectations(suite.T())
}

func TestRunAllAuthenticationServiceTestSuites(t *testing.T) {
	suite.Run(t, new(authenticateAdminTestSuite))
}
package service

import (
	"errors"
	"testing"
	"time"

	repoMock "github.com/shharn/blog/repository/mock"
	"github.com/shharn/blog/model"
	"github.com/shharn/blog/session"
	sessionMock "github.com/shharn/blog/session/mock"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/suite"
)

type validateEmailAnsPasswordTestSuite struct {
	suite.Suite
	mc *repoMock.MockContext
	mr *repoMock.MockAuthenticationRepository
}

func (suite *validateEmailAnsPasswordTestSuite) SetupTest() {
	suite.mc = new(repoMock.MockContext)
	suite.mr = new(repoMock.MockAuthenticationRepository)
}

func (suite *validateEmailAnsPasswordTestSuite) TestHappyPathWithCorrectEmailAndPassword() {
	mockEmail := "email@test.com"
	mockPassword := "password"
	svc := NewAuthenticationService(suite.mr, &sessionMock.MockSessionStorage{}, &sessionMock.MockTokenMaker{})
	suite.mc.On("Dispose").Once()
	suite.mr.On("Context").Return(suite.mc).Once()
	suite.mr.On("Authenticate", suite.mc, mockEmail, mockPassword).Return(true, nil)

	valid := svc.ValidateEmailAndPassword(mockEmail, mockPassword)

	assert.True(suite.T(), valid)
	suite.mc.AssertExpectations(suite.T())
	suite.mr.AssertExpectations(suite.T())
}

func (suite *validateEmailAnsPasswordTestSuite) TestHappyPathWithIncorrectEmailAndPassword() {
	mockEmail := "email@test.com"
	mockPassword := "password"
	svc := NewAuthenticationService(suite.mr, &sessionMock.MockSessionStorage{}, &sessionMock.MockTokenMaker{})
	suite.mc.On("Dispose").Once()
	suite.mr.On("Context").Return(suite.mc).Once()
	suite.mr.On("Authenticate", suite.mc, mockEmail, mockPassword).Return(false, nil)

	valid := svc.ValidateEmailAndPassword(mockEmail, mockPassword)

	assert.False(suite.T(), valid)
	suite.mc.AssertExpectations(suite.T())
	suite.mr.AssertExpectations(suite.T())
}

func (suite *validateEmailAnsPasswordTestSuite) TestWhenErrorFromRepository() {
	mockEmail := "email@test.com"
	mockPassword := "password"
	mockError := errors.New("mock error")
	svc := NewAuthenticationService(suite.mr, &sessionMock.MockSessionStorage{}, &sessionMock.MockTokenMaker{})
	suite.mc.On("Dispose").Once()
	suite.mr.On("Context").Return(suite.mc).Once()
	suite.mr.On("Authenticate", suite.mc, mockEmail, mockPassword).Return(false, mockError)

	valid := svc.ValidateEmailAndPassword(mockEmail, mockPassword)

	assert.False(suite.T(), valid)
	suite.mc.AssertExpectations(suite.T())
	suite.mr.AssertExpectations(suite.T())
}

type createTokenTestSuite struct {
	suite.Suite
	mc *repoMock.MockContext
	mr *repoMock.MockAuthenticationRepository
}

func (suite *createTokenTestSuite) SetupTest() {
	suite.mc = new(repoMock.MockContext)
	suite.mr = new(repoMock.MockAuthenticationRepository)
}

func (suite *createTokenTestSuite) HappyPath() {
	mockSession := session.Session{}
	mockToken := "token"
	mockEmail := "email@test.com"
	mockTransformFunc := func (email string) (session.Session, error) {
		return mockSession, nil
	}

	mockSessionStorage := &sessionMock.MockSessionStorage{}
	mockTokenMaker := &sessionMock.MockTokenMaker{}
	svc := NewAuthenticationService(suite.mr, mockSessionStorage, mockTokenMaker)
	mockTokenMaker.On("Encode", mockSession).Return(mockToken, nil).Once()

	result, err := svc.CreateToken(mockEmail, mockTransformFunc)
	assert.Equal(suite.T(), mockToken, result)
	assert.Nil(suite.T(), err)
	mockTokenMaker.AssertExpectations(suite.T())
}

func (suite *createTokenTestSuite) TestWhenTransformFuncThrowError() {
	mockEmail := "email@test.com"
	mockError := errors.New("mock error")
	mockTransformFunc := func (email string) (session.Session, error) {
		return session.Session{}, mockError
	}
	mockSessionStorage := &sessionMock.MockSessionStorage{}
	mockTokenMaker := &sessionMock.MockTokenMaker{}
	svc := NewAuthenticationService(suite.mr, mockSessionStorage, mockTokenMaker)

	result, err := svc.CreateToken(mockEmail, mockTransformFunc)

	assert.Equal(suite.T(), "", result)
	assert.Equal(suite.T(), mockError, err)
	mockTokenMaker.AssertExpectations(suite.T())
}

func (suite *createTokenTestSuite) TestWhenTokenMakerThrowError() {
	mockEmail := "email@test.com"
	mockError := errors.New("mock error")
	mockSession := session.Session{}
	mockTransformFunc := func (email string) (session.Session, error) {
		return mockSession, nil
	}
	mockSessionStorage := &sessionMock.MockSessionStorage{}
	mockTokenMaker := &sessionMock.MockTokenMaker{}
	svc := NewAuthenticationService(suite.mr, mockSessionStorage, mockTokenMaker)

	mockTokenMaker.On("Encode", mockSession).Return("", mockError)
	result, err := svc.CreateToken(mockEmail, mockTransformFunc)

	assert.Equal(suite.T(), "", result)
	assert.Equal(suite.T(), mockError, err)
	mockTokenMaker.AssertExpectations(suite.T())
}

type storeTokenTestSuite struct {
	suite.Suite
	mc *repoMock.MockContext
	mr *repoMock.MockAuthenticationRepository
}

func (suite *storeTokenTestSuite) SetupTest() {
	suite.mc = new(repoMock.MockContext)
	suite.mr = new(repoMock.MockAuthenticationRepository)
}

func (suite *storeTokenTestSuite) TestHappyPath() {
	mockToken := "mock token"
	d := time.Millisecond * 10
	mockSessionStorage := &sessionMock.MockSessionStorage{}
	mockTokenMaker := &sessionMock.MockTokenMaker{}
	svc := NewAuthenticationService(suite.mr, mockSessionStorage, mockTokenMaker)

	mockSessionStorage.On("Put", mockToken).Once()
	mockSessionStorage.On("Remove", mockToken).Once()
	
	svc.StoreToken(mockToken, d)
	
	time.Sleep(time.Millisecond * 20)
	mockSessionStorage.AssertExpectations(suite.T())
}

type validateTokenTestSuite struct {
	suite.Suite
	mc *repoMock.MockContext
	mr *repoMock.MockAuthenticationRepository
}

func (suite *validateTokenTestSuite) SetupTest() {
	suite.mc = new(repoMock.MockContext)
	suite.mr = new(repoMock.MockAuthenticationRepository)
}

func (suite *validateTokenTestSuite) TestHappyPath() {
	mockToken := "mock token"
	mockSession := &session.Session{Platform: "google", Admin: true}
	mockSessionStorage := &sessionMock.MockSessionStorage{}
	mockTokenMaker := &sessionMock.MockTokenMaker{}
	svc := NewAuthenticationService(suite.mr, mockSessionStorage, mockTokenMaker)

	mockSessionStorage.On("Has", mockToken).Return(true).Once()
	mockTokenMaker.On("Decode", mockToken).Return(mockSession, nil).Once()
	
	result, err := svc.ValidateToken(mockToken)

	assert.Equal(suite.T(), model.Authentication{IsValid: true, Platform: "google", Admin: true}, result)
	assert.Nil(suite.T(), err)
	mockSessionStorage.AssertExpectations(suite.T())
	mockTokenMaker.AssertExpectations(suite.T())
}

func (suite *validateTokenTestSuite) TestWhenSessionStorageHasNoToken() {
	mockToken := "mock token"
	mockSessionStorage := &sessionMock.MockSessionStorage{}
	mockTokenMaker := &sessionMock.MockTokenMaker{}
	svc := NewAuthenticationService(suite.mr, mockSessionStorage, mockTokenMaker)

	mockSessionStorage.On("Has", mockToken).Return(false).Once()

	result, err := svc.ValidateToken(mockToken)

	assert.Equal(suite.T(), model.InvalidAuthentication, result)
	assert.Equal(suite.T(), InvalidTokenError, err)
	mockSessionStorage.AssertExpectations(suite.T())
}

func (suite *validateTokenTestSuite) TestWhenTokenMakerThrowError() {
	mockToken := "mock token"
	mockSession := &session.Session{}
	mockError := errors.New("mock error")
	mockSessionStorage := &sessionMock.MockSessionStorage{}
	mockTokenMaker := &sessionMock.MockTokenMaker{}
	svc := NewAuthenticationService(suite.mr, mockSessionStorage, mockTokenMaker)

	mockSessionStorage.On("Has", mockToken).Return(true).Once()
	mockTokenMaker.On("Decode", mockToken).Return(mockSession, mockError).Once()
	mockSessionStorage.On("Remove", mockToken)
	
	result, err := svc.ValidateToken(mockToken)

	assert.Equal(suite.T(), model.InvalidAuthentication, result)
	assert.Equal(suite.T(), mockError, err)
	mockSessionStorage.AssertExpectations(suite.T())
	mockTokenMaker.AssertExpectations(suite.T())
}

type revokeTokenTestSuite struct {
	suite.Suite
	mc *repoMock.MockContext
	mr *repoMock.MockAuthenticationRepository
}

func (suite *revokeTokenTestSuite) SetupTest() {
	suite.mc = new(repoMock.MockContext)
	suite.mr = new(repoMock.MockAuthenticationRepository)
}

func (suite *revokeTokenTestSuite) TestHappyPath() {
	mockToken := "mock token"
	mockSessionStorage := &sessionMock.MockSessionStorage{}
	mockTokenMaker := &sessionMock.MockTokenMaker{}
	svc := NewAuthenticationService(suite.mr, mockSessionStorage, mockTokenMaker)

	mockSessionStorage.On("Remove", mockToken).Once()

	svc.RevokeToken(mockToken)

	mockSessionStorage.AssertExpectations(suite.T())
}

func TestRunAllAuthenticationServiceTestSuites(t *testing.T) {
	suite.Run(t, new(validateEmailAnsPasswordTestSuite))
	suite.Run(t, new(createTokenTestSuite))
	suite.Run(t, new(storeTokenTestSuite))
	suite.Run(t, new(validateTokenTestSuite))
	suite.Run(t, new(revokeTokenTestSuite))
}
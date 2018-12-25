package session

import (
	"crypto/rand"
	"sync"

	"github.com/pkg/errors"
	"github.com/shharn/blog/logger"
	"github.com/sirupsen/logrus"
)

// KeyManager manages a key
type keyManager struct {
	key []byte
	rwLock *sync.RWMutex
}

// GetKey returns the current key
func (km *keyManager) GetKey() []byte {
	km.rwLock.RLock()
	defer km.rwLock.RUnlock()
	return km.key
}

// RegenerateKey recreates a key
func (km *keyManager) GenerateKey() error {
	km.rwLock.Lock()
	defer km.rwLock.Unlock()

	b := make([]byte, 32)
	if _, err := rand.Read(b); err != nil {
		return errors.WithStack(err)
	}
	km.key = b
	logger.Logger.WithFields(logrus.Fields{
		"key": km.key,
	}).Trace("Newly created key")
	return nil
}

// NewKeyManager creates a KeyManager
func newKeyManager() *keyManager {
	instance := &keyManager{
		rwLock: &sync.RWMutex{},
	}
	instance.GenerateKey()
	logger.Logger.WithFields(logrus.Fields{
		"key": instance.GetKey(),
	}).Trace("First key value")
	return instance
}
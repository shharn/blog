package session

import (
	"sync"
)

type sessionStorage interface {
	Put(key string)
	Has(key string) bool
	Remove(key string)
}

var (
	storageInstance sessionStorage
	storageOnce sync.Once
)

type mapSessionStorage struct {
	storage map[string]bool
	lock *sync.RWMutex 
}

func (s *mapSessionStorage) Put(key string) {
	s.lock.Lock()
	defer s.lock.Unlock()
	s.storage[key] = true
}

func (s *mapSessionStorage) Has(key string) bool {
	s.lock.RLock()
	defer s.lock.RUnlock()
	_, ok := s.storage[key]
	return ok
}

func (s *mapSessionStorage) Remove(key string) {
	s.lock.Lock()
	defer s.lock.Unlock()
	delete(s.storage, key)
}

func BlogSessionStorage() sessionStorage {
	storageOnce.Do(func () {
		storageInstance = &mapSessionStorage{
			storage: map[string]bool{},
			lock: &sync.RWMutex{},
		}
	})
	return storageInstance
}
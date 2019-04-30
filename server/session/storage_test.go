package session

import (
	"fmt"
	"sync"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestBlogSessionStorageSingleton(t *testing.T) {
	s1 := BlogSessionStorage()
	s2 := BlogSessionStorage()
	s3 := BlogSessionStorage()
	assert.Equal(t, s1, s2)
	assert.Equal(t, s1, s3)
	assert.Equal(t, s2, s3)
}

func TestBlogSessionStorage(t *testing.T) {
	s := BlogSessionStorage()
	assert.NotNil(t, s)

	s.Put("test")
	r := s.Has("test")
	assert.True(t, r)

	r2 := s.Has("asdf")
	assert.False(t, r2)
}

func TestConcurrentPut(t *testing.T) {
	s := BlogSessionStorage()
	assert.NotNil(t, s)

	wg := sync.WaitGroup{}
	for i := 0; i < 100; i ++ {
		wg.Add(1)
		go func (n int) {
			defer wg.Done()
			s.Put(fmt.Sprintf("token%v", n))
		}(i)
	}
	wg.Wait()

	for i := 0; i < 100; i++ {
		r3 := s.Has(fmt.Sprintf("token%v", i))
		assert.True(t, r3)
	}
}

func TestRemove(t *testing.T) {
	s := BlogSessionStorage()
	assert.NotNil(t, s)

	testKey := "testremovetoken"

	r := s.Has(testKey)
	assert.False(t, r)

	s.Put(testKey)
	r = s.Has(testKey)
	assert.True(t, r)

	s.Remove(testKey)
	r = s.Has(testKey)
	assert.False(t, r)
}
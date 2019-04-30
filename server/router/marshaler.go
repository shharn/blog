package router

import (
	"encoding/json"
	"github.com/pkg/errors"
)

// Marshaler processes the result of the Handler.
// I'll place the JSON Marshaller on it
type Marshaler interface {
	Marshal(interface{}) ([]byte, error)
	ContentType() string
}

// JSONMarshaler marshals the object to JSON formatted byte array
type JSONMarshaler struct{}

// Marshal do marshal the object to something
func (j JSONMarshaler) Marshal(obj interface{}) ([]byte, error) {
	if obj == nil {
		return nil, nil
	}
	if bytes, err := json.Marshal(obj); err == nil {
		return bytes, nil
	} else {
		return nil, errors.WithStack(err)
	}
}

func (j JSONMarshaler) ContentType() string {
	return "application/json"
}

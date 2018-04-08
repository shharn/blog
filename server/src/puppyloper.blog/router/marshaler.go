package router

import (
	"encoding/json"
)

// Marshaler processes the result of the Handler.
// I'll place the JSON Marshaller on it
type Marshaler interface {
	Marshal(interface{}) ([]byte, error)
}

// JSONMarshaler marshals the object to JSON formatted byte array
type JSONMarshaler struct{}

// Marshal do marshal the object to something
func (j JSONMarshaler) Marshal(obj interface{}) ([]byte, error) {
	return json.Marshal(obj)
}

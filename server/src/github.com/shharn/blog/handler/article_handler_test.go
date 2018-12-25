package handler

import (
	"testing"

	"github.com/stretchr/testify/assert"
)


func TestDecodeURIComponent(t *testing.T) {
	inputAndOutput := map[string]string{
		"oneword": "oneword",
		"two%20word": "two word",
		"words-with-dash": "words-with-dash",
		"Uppercase": "Uppercase",
		"Uppercase lowercase": "Uppercase lowercase",
		"Uppercase%20lowercase%20%23%23%23": "Uppercase lowercase ###",
		"!%40%23%24%25%5E%26*()-%3D_%2B": "!@#$%^&*()-=_+",
		"%ED%95%9C%EA%B8%80": "한글",
		"%ED%95%9C%EA%B8%80%20%EB%9D%84%EC%96%B4%EC%93%B0%EA%B8%B0%20!!!": "한글 띄어쓰기 !!!",
	}
	for input, expected := range inputAndOutput {
		actual, _ := decodeURIComponent(input)
		assert.Equal(t, expected, actual)
	}
}

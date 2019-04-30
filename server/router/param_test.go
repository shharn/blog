package router

import (
	"testing"

	"github.com/stretchr/testify/assert"
)


type inputAndOutput struct {
	input string
	output Params
}

var testData map[string][]inputAndOutput = map[string][]inputAndOutput{
	"*": []inputAndOutput{
		0: inputAndOutput{
			input: "/",
			output: Params{},
		},
		1: inputAndOutput{
			input: "/asdf",
			output: Params{},
		},
		2: inputAndOutput{
			input: "/123/dvaks",
			output: Params{},
		},
	},
	"/asdf/*": []inputAndOutput{
		0: inputAndOutput{
			input: "/asdf/0x11",
			output: Params{},
		},
		1: inputAndOutput{
			input: "/asdf/false/1213",
			output: Params{},
		},
	},
	"/asdf/:id/*": []inputAndOutput{
		0: inputAndOutput{
			input: "/asdf/000/gkdj",
			output: Params{
				"id": "000",
			},
		},
	},
	"/path/:aa/*/:bb": []inputAndOutput{
		0: inputAndOutput{
			input: "/path/1/path2/2",
			output: Params{
				"aa": "1",
				"bb": "2",
			},
		},
		1: inputAndOutput{
			input: "/path/1/path222/2",
			output: Params{
				"aa": "1",
				"bb": "2",
			},
		},
		2: inputAndOutput{
			input:"/path/1/path2/3/fff",
			output: Params{},
		},
	},
	"/": []inputAndOutput{
		0: inputAndOutput{
			input: "/",
			output: Params{},
		},
		1: inputAndOutput{
			input: "/test",
			output: Params{},
		},
		2: inputAndOutput{
			input: "/2",
			output: Params{},
		},
		3: inputAndOutput{
			input: "/test/1",
			output: Params{},
		},
		4: inputAndOutput{
			input: "//",
			output: Params{},
		},
	},
	"/test": []inputAndOutput{
		0: inputAndOutput{
			input: "/",
			output: Params{},	
		},
		1: inputAndOutput{
			input: "/test",
			output: Params{},
		},
		2: inputAndOutput{
			input: "/test/1",
			output: Params{},
		},
	},
	"/:id": []inputAndOutput{
		0: inputAndOutput{
			input: "/",
			output: Params{"id": ""},
		},
		1: inputAndOutput{
			input: "/2/1",
			output: Params{},
		},
		2: inputAndOutput{
			input: "/1",
			output: Params{"id": "1"},
		},
		3: inputAndOutput{
			input: "/test",
			output: Params{"id": "test"},
		},
		4: inputAndOutput{
			input: "/false",
			output: Params{"id": "false"},
		},
	},
	"/:param": []inputAndOutput{
		0: inputAndOutput{
			input: "/",
			output: Params{"param": ""},
		},
		1: inputAndOutput{
			input: "/param",
			output: Params{"param": "param"},
		},
		2: inputAndOutput{
			input: "/param/234",
			output: Params{},
		},
	},
	"/path1/:param/path2": []inputAndOutput{
		0: inputAndOutput{
			input: "/path1",
			output: Params{},
		},
		1: inputAndOutput{
			input: "/path1/111",
			output: Params{},
		},
		2: inputAndOutput{
			input: "/path2/111/path2",
			output: Params{},
		},
		3: inputAndOutput{
			input: "/path1/111/path2",
			output: Params{"param": "111"},
		},
		4: inputAndOutput{
			input: "/path1/1111/path3",
			output: Params{},
		},
		5: inputAndOutput{
			input: "/path1/11111/path2/haha",
			output: Params{},
		},
	},
}

func TestParseURL(t *testing.T) {
	for pattern, inputAndOutputs := range testData {
		for _, inputAndOutput := range inputAndOutputs {
			input := inputAndOutput.input
			expected := inputAndOutput.output
			actual := parseURL(pattern, input)
			assert.Equal(t, expected, actual)
		}
	}
}
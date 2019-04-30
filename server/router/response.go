package router

var (
	EmptyErrorResponse = ErrorResponse{}
)

type ErrorResponse struct {
	Code int `json:"-"`
	Message string `json:"message,omitempty"`
	InnerError error `json:"-"`
}

func NewErrorResponse(code int, message string) ErrorResponse {
	return ErrorResponse{code, message, nil}
}

func NewErrorResponseWithError(code int, message string, err error) ErrorResponse {
	return ErrorResponse{code, message, err}
}
FROM golang:1.9.5-alpine3.7

WORKDIR /go/src/app

COPY . .

RUN go get github.com/dgrijalva/jwt-go
RUN go get -u -v github.com/dgraph-io/dgo
RUN go install ./puppyloper.blog/main

CMD ["main"]
FROM golang:1.9.5

WORKDIR /go

COPY ./src .

RUN go get github.com/dgrijalva/jwt-go
RUN go get -u -v github.com/dgraph-io/dgo
RUN go install github.com/shharn/blog/main

EXPOSE 10000

CMD ["../bin/main"]`
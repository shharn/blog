FROM golang:1.9.5

WORKDIR /go

COPY . .

RUN go get -u -v github.com/dgraph-io/dgo \ 
&& go get github.com/pilu/fresh
# && go get -u -v github.com/derekparker/delve/cmd/delve \

# EXPOSE 2345
EXPOSE 10000

# CMD ["div", "debug", "--headless", "--listen=:2345", "--log"]
CMD ["./bin/fresh", "-c",  "runner.conf"]
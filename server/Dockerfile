###### base image
# FROM golang:1.9.5 as base
# ARG app_env
# ENV APP_ENV=${app_env}
# WORKDIR /go
# COPY . .
# RUN go get ./src/github.com/shharn/blog && go install github.com/shharn/blog 

FROM golang:1.10.2
WORKDIR /go
ENV PATH $GOPATH/bin:/usr/local/go/bin:$PATH
COPY ./src/github.com/shharn/blog /go/src/github.com/shharn/blog
RUN go get github.com/tockins/realize

CMD ["realize", "start", "--path", "./src/github.com/shharn/blog", "--run"]

###### part for production image
# FROM golang:1.9.5-alpine3.7 as prod
# RUN CGO_ENABLED=0 GOOS=linux 
# COPY --from=base /go/bin /go/bin
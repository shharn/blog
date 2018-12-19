FROM golang:1.11.1-alpine3.8 as base
WORKDIR /go
COPY . /go
RUN apk update && \
    apk upgrade && \
    apk add git tzdata make && \
    make install

FROM golang:1.11.1-alpine3.8
ENV LOG_LEVEL=info \
    ENVIRONMENT=production \
    TZ=Asia/Seoul
COPY --from=base /go/bin /go/bin
CMD ["blog"]
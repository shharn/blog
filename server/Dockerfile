FROM golang:1.12.4-alpine3.9 as base

ARG GOOGLE_OAUTH_CLIENT_ID
ARG GOOGLE_OAUTH_CLIENT_SECRET
ARG OAUTH_CSRF_STATE

WORKDIR /app
COPY . .
RUN apk update && \
    apk upgrade && \
    apk add git tzdata make && \
    make build

FROM golang:1.12.4-alpine3.9
WORKDIR /app
ENV LOG_LEVEL=info \
    ENVIRONMENT=production \
    TZ=Asia/Seoul \ 
    GOOGLE_OAUTH_CLIENT_ID=${GOOGLE_OAUTH_CLIENT_ID} \
    GOOGLE_OAUTH_CLIENT_SECRET=${GOOGLE_OAUTH_CLIENT_SECRET} \
    OAUTH_CSRF_STATE=${OAUTH_CSRF_STATE} \
    OAUTH_HOST_OF_REDIRECT_URL=https://blog.puppyloper.com/oauth/authorizations/google/callback
COPY --from=base /app/bin /app/bin
CMD ["bin/blog"]

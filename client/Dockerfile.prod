FROM node:8.11.3-alpine as base
WORKDIR /app
COPY . .
RUN yarn install && \
        yarn build:prod

FROM node:8.11.3-alpine
WORKDIR /app
ENV NODE_ENV=production \
    TZ=Asia/Seoul \
    BUCKET_NAME=puppyloper-blog \
    PROJECT_ID=blog-xxxx \
    IMAGE_BASE_URL=https://storage.googleapis.com \
    GOOGLE_APPLICATION_CREDENTIALS=./storage-credential.json
COPY --from=base /app/public /app/public
COPY --from=base /app/front-server /app/front-server
RUN yarn add \ 
    express@^4.16.4 \
    chalk@^2.4.1 \
    multer@^1.3.1 \
    superagent@^3.8.2 \
    mkdirp@^0.5.1 \
    winston@^3.1.0
CMD ["node", "front-server/server.js"]
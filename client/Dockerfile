FROM node:8.11.3-alpine as base

ARG PROJECT_ID

WORKDIR /app
COPY . .
RUN yarn install && \
        yarn build:prod

FROM node:8.11.3-alpine
WORKDIR /app
ENV NODE_ENV=production \
    BUCKET_NAME=puppyloper-test \
    PROJECT_ID=${PROJECT_ID} \
    IMAGE_BASE_URL=https://storage.googleapis.com \
    IMAGE_FOLDER_NAME=images \
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
CMD ["yarn", "start:prod"]
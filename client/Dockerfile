FROM node:8.11.3-alpine

ARG PROJECT_ID
ARG BUCKET_NAME

ENV NODE_ENV=production \
    TZ=Asia/Seoul \
    BUCKET_NAME=${BUCKET_NAME} \
    PROJECT_ID=${PROJECT_ID} \
    IMAGE_BASE_URL=https://storage.googleapis.com \
    IMAGE_FOLDER_NAME=images \
    GOOGLE_APPLICATION_CREDENTIALS=./storage-credential.json
WORKDIR /app
COPY . .
RUN yarn install && \
        yarn build:prod

CMD ["yarn", "start:prod"]
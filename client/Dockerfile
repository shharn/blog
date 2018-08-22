FROM node:8.11.3-alpine

WORKDIR /app

COPY . .

RUN yarn global add nodemon \
    && yarn install

CMD ["yarn", "start"]
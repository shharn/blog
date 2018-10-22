FROM node:8.11.3-alpine as base
WORKDIR /app
COPY . .
RUN yarn install && \
    yarn build

FROM node:8.11.3-alpine as production
WORKDIR /app
COPY --from=base /app/public /app/public
COPY --from=base /app/front-server /app/front-server
RUN yarn add express chalk multer superagent mkdirp
CMD ["node", "front-server/server.js"]
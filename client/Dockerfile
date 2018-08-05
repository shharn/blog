FROM node:10.8.0-alpine

WORKDIR /app

COPY . .

RUN npm install && \
    npm rebuild node-sass

CMD ["npm", "start"]
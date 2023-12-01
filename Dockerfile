FROM node:21-slim

ENV NODE_ENV production

WORKDIR /app

COPY package*.json src/index.js .env ./

RUN npm install

EXPOSE 80

CMD [ "node", "index.js" ]
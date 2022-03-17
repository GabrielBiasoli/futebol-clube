FROM node:16-alpine AS build

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm install

COPY . .
EXPOSE 3001
ENTRYPOINT ["npm", "start"]

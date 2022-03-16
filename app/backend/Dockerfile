FROM node:16-alpine AS build

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:16-alpine
COPY --from=build /usr/src/app/build .
EXPOSE 3001
ENTRYPOINT ["node", "server.js"]

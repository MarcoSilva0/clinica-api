# backend/Dockerfile
FROM node:20

WORKDIR /app

COPY package*.json ./
RUN yarn install

COPY . .

RUN yarn run build

EXPOSE 3001

CMD ["node", "dist/main"]

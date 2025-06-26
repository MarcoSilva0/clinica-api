FROM node:20-alpine AS build

WORKDIR /app

run apk add --no-cache openssl

COPY package*.json yarn.lock ./
COPY prisma/schema.prisma ./prisma/

ENV PRISMA_CLI_QUERY_ENGINE_TYPE=linux-musl

RUN yarn install

RUN yarn prisma generate

COPY . .

RUN yarn build

FROM node:20-alpine AS final

WORKDIR /app

RUN apk add --no-cache wget

COPY --from=build /app/dist /app/dist
COPY --from=build /app/package*.json /app/
COPY --from=build /app/yarn.lock /app/
COPY --from=build /app/.env* ./
COPY --from=build /app/prisma /app/prisma

RUN echo "Installing production dependencies"; \
    yarn install;

EXPOSE 3001

CMD ["node", "dist/main"]
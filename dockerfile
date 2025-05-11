FROM node:20-alpine

WORKDIR /app

# Install NestJS CLI globally
RUN yarn global add @nestjs/cli

EXPOSE 3000

# The command will come from docker-compose.yml
CMD ["yarn", "start:dev"]
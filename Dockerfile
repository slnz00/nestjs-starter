# Build
FROM node:18-alpine AS app-builder

RUN apk --update --no-cache add bash git less openssh gpgme

ENV APP_DIR /usr/app
RUN mkdir -p $APP_DIR
WORKDIR $APP_DIR

COPY package.json yarn.lock ./
RUN yarn install --no-progress

COPY . .

ARG ENV_NAME
ARG ENV_SECRET

# Decrypt the environment defined by ENV_NAME variable using the secret defined in ENV_SECRET variable
#   /env/.env.[ENV_NAME].encrypted (AES encrypted .env file) -> /env/.env.[ENV_NAME] (Plain text, standard .env file)
# Copy decrypted .env file to the project root, named as .env
#   /env/.env.[ENV_NAME] -> /.env
# Delete env directory to keep the docker image clean by only maintaining the necessary environment variables (/.env)
RUN yarn env:secret:save && \
    yarn env:use && \
    rm -rf env

RUN yarn build && \
    rm -rf node_modules && \
    yarn install --prod --no-progress

# App
FROM node:18-alpine

RUN apk --update --no-cache add bash curl

ENV APP_DIR /usr/app
RUN mkdir -p $APP_DIR
WORKDIR $APP_DIR

COPY --from=app-builder $APP_DIR .

CMD yarn start:prod
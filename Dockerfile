# Build
FROM node:18-alpine AS app-builder

RUN apk --update --no-cache add bash git less openssh gpgme

ENV APP_DIR /usr/app
RUN mkdir -p $APP_DIR
WORKDIR $APP_DIR

COPY package.json yarn.lock ./
RUN yarn install --no-progress

COPY . .

ARG CONFIG_NAME
ARG CONFIG_SECRET

# Decrypt the environment defined by CONFIG_NAME argument using the secret defined in CONFIG_SECRET argument
#   /config/[CONFIG_NAME].encrypted (AES encrypted config.json file) -> /config/[CONFIG_NAME].json (Plain text, standard json file)
# Delete encrypted config files
RUN yarn config:secret:save && \
    yarn config:use && \
    rm -rf config/encrypted

RUN yarn build && \
    rm -rf node_modules && \
    yarn install --prod --no-progress

# App
FROM node:18-alpine

ARG CONFIG_NAME
ENV CONFIG_ENV=$CONFIG_NAME

RUN apk --update --no-cache add bash curl

ENV APP_DIR /usr/app
RUN mkdir -p $APP_DIR
WORKDIR $APP_DIR

COPY --from=app-builder $APP_DIR .

CMD yarn start:prod
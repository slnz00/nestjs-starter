#!/bin/bash
set -e

DEPLOY_ENVIRONMENT_NAME=$1

if [[ -z "$DEPLOY_ENVIRONMENT_NAME" ]]; then
  printf "Error: No deploy environment name was provided, first argument should be an environment name %s\n" $DEPLOY_ENVIRONMENT_NAME
  exit
fi

DEPLOY_ENVIRONMENT_PATH="./env/${DEPLOY_ENVIRONMENT_NAME}.env"
if test -f "$DEPLOY_ENVIRONMENT_PATH"; then
  set -o allexport; source "$DEPLOY_ENVIRONMENT_PATH"; set +o allexport
fi

if [[ -z "$HEROKU_APP_NAME" ]]; then
  printf "Error: No Heroku app name was provided, define the app name by defining the HEROKU_APP_NAME variable in the deployment environment file\n"
  exit
fi

if [[ -z "$CONFIG_NAME" ]]; then
  printf "Error: No environment was provided, define the config name by defining the CONFIG_NAME variable in the deployment config file\n"
  exit
fi

CONFIG_SECRET_PATH="./configs/${CONFIG_NAME}.json.aes"
CONFIG_SECRET=$(cat "${CONFIG_SECRET_PATH}")

heroku container:login && echo ""

DOCKER_IMAGE=registry.heroku.com/"$HEROKU_APP_NAME"/web
docker build --build-arg CONFIG_NAME="$CONFIG_NAME" --build-arg CONFIG_SECRET="$CONFIG_SECRET" -t "$DOCKER_IMAGE" .

printf "\nPushing docker image...\n"
docker push "$DOCKER_IMAGE"

printf "\nReleasing to heroku...\n"
heroku container:release web --app "$HEROKU_APP_NAME"

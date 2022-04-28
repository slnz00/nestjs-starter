#!/bin/bash
set -e

# Arguments:
#   Environment name

[ -n "$1" ] && ENV_NAME=$1

ENV_PATH="./env/.env.${ENV_NAME}"

if [[ -z "${ENV_NAME}" ]]; then
  echo "Warning: Use environment script is ran without environment name argument, skipping..."
else
  echo "Using environment: ${ENV_NAME}"
  ./dev/env/decrypt-env.sh "${ENV_NAME}"
  /bin/cp -rf "${ENV_PATH}" ".env"
fi

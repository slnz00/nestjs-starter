#!/bin/bash
set -e

# Arguments:
#   Environment name
#   Environment secret

[ -n "$1" ] && ENV_NAME=$1
[ -n "$2" ] && ENV_SECRET=$2

ENV_SECRET_PATH="./env/${ENV_NAME}.env.aes"

rm -rf "${ENV_SECRET_PATH}"
echo -e "${ENV_SECRET}\c" >> "${ENV_SECRET_PATH}"

echo "Saved config secret to: ${ENV_SECRET_PATH}"

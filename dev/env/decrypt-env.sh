#!/bin/bash
set -e

# Arguments:
#   Environment name

[ -n "$1" ] && ENV_NAME=$1

ENCRYPTED_PATH="./env/.env.${ENV_NAME}.encrypted"
DECRYPTED_PATH="./env/.env.${ENV_NAME}"
ENV_SECRET_PATH="./env/.env.${ENV_NAME}.aes"
AES_PASSWORD=$(cat "${ENV_SECRET_PATH}")

echo "${AES_PASSWORD}" | \
  gpg --batch \
      --yes \
      --passphrase-fd 0 \
      --output "${DECRYPTED_PATH}" \
      --decrypt "${ENCRYPTED_PATH}"

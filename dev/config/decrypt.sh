#!/bin/bash
set -e

# Arguments:
#   Config name

[ -n "$1" ] && CONFIG_NAME=$1

ENCRYPTED_PATH="./config/environments/${CONFIG_NAME}.encrypted"
DECRYPTED_PATH="./config/environments/${CONFIG_NAME}.json"
SECRET_PATH="./config/environments/${CONFIG_NAME}.aes"
AES_PASSWORD=$(cat "${SECRET_PATH}")

echo "${AES_PASSWORD}" | \
  gpg --batch \
      --yes \
      --passphrase-fd 0 \
      --output "${DECRYPTED_PATH}" \
      --decrypt "${ENCRYPTED_PATH}"


ENCRYPTED_DEPLOYMENT_PATH="./config/environments/${CONFIG_NAME}.deployment.encrypted"
DECRYPTED_DEPLOYMENT_PATH="./config/environments/${CONFIG_NAME}.deployment.json"

if test -f "${ENCRYPTED_DEPLOYMENT_PATH}"; then
    echo "${AES_PASSWORD}" | \
      gpg --batch \
          --yes \
          --passphrase-fd 0 \
          --output "${DECRYPTED_DEPLOYMENT_PATH}" \
          --decrypt "${ENCRYPTED_DEPLOYMENT_PATH}"
fi
#!/bin/bash
set -e

# Arguments:
#   Config name

[ -n "$1" ] && CONFIG_NAME=$1

ENCRYPTED_PATH="./config/${CONFIG_NAME}.encrypted"
DECRYPTED_PATH="./config/${CONFIG_NAME}.json"
SECRET_PATH="./config/${CONFIG_NAME}.aes"
AES_PASSWORD=$(cat "${SECRET_PATH}")

echo "${AES_PASSWORD}" | \
  gpg --batch \
      --yes \
      --passphrase-fd 0 \
      --output "${DECRYPTED_PATH}" \
      --decrypt "${ENCRYPTED_PATH}"

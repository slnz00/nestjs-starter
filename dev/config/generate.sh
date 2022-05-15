#!/bin/bash
set -e

# Arguments:
#   Config name

[ -n "$1" ] && CONFIG_NAME=$1

DECRYPTED_PATH="./config/environments/${CONFIG_NAME}.json"
DECRYPTED_DEPLOYMENT_PATH="./config/environments/${CONFIG_NAME}.deployment.json"
SECRET_PATH="./config/environments/${CONFIG_NAME}.aes"

if test -f "${DECRYPTED_PATH}"; then
    echo "Warning: ${DECRYPTED_PATH} already exists, skipping..."
    exit 0
fi

if test -f "${DECRYPTED_DEPLOYMENT_PATH}"; then
    echo "Warning: ${DECRYPTED_DEPLOYMENT_PATH} already exists, skipping..."
    exit 0
fi

echo "{}" > "${DECRYPTED_PATH}"
echo "{}" > "${DECRYPTED_DEPLOYMENT_PATH}"

SECRET=$(dev/config/generate-secret.sh)
echo -n "${SECRET}" > "${SECRET_PATH}"

#!/bin/bash
set -e

# Arguments:
#   Config name
#   Config secret

[ -n "$1" ] && CONFIG_NAME=$1
[ -n "$2" ] && CONFIG_SECRET=$2

SECRET_PATH="./config/environments/${CONFIG_NAME}.aes"

rm -rf "${SECRET_PATH}"
echo -e "${CONFIG_SECRET}\c" >> "${SECRET_PATH}"

echo "Saved config secret to: ${SECRET_PATH}"

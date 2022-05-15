#!/bin/bash
set -e

# Arguments:
#   Config name

[ -n "$1" ] && CONFIG_NAME=$1

CONFIG_PATH="config/environments/${CONFIG_NAME}.json"
LOCAL_CONFIG_PATH="config/local.json"

if [[ -z "${CONFIG_NAME}" ]]; then
  echo "Warning: Use config script is ran without config name argument, skipping..."
else
  echo "Using config: ${CONFIG_NAME}"
  ./dev/config/decrypt.sh "${CONFIG_NAME}"
  cp -fr "${CONFIG_PATH}" "${LOCAL_CONFIG_PATH}"
fi

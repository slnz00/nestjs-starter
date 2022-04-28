#!/bin/bash
set -e

# Arguments:
#   Config name

[ -n "$1" ] && CONFIG_NAME=$1

CONFIG_PATH="config/${CONFIG_NAME}.json"

if [[ -z "${CONFIG_NAME}" ]]; then
  echo "Warning: Use config script is ran without config name argument, skipping..."
else
  echo "Using config: ${CONFIG_NAME}"
  ./dev/config/decrypt.sh "${CONFIG_NAME}"

  # Remove other files from config directory except the selected, decrypted config json
  mkdir -p tmp/config
  ln "$CONFIG_PATH" tmp/"${CONFIG_PATH}"
  rm -rf config/*
  mv tmp/"${CONFIG_PATH}" config
fi

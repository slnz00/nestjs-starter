#!/bin/bash
set -e

# Start docker compose services, if they are not running
if [ -z "$(docker compose ps -q app)" ] || [ -z "$(docker ps -q --no-trunc | grep "$(docker compose ps -q app)")" ]; then
  ./dev/docker/start.sh
fi

docker compose exec app "$@"

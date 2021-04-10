#!/bin/sh
export _UID=$(id -u)
export _GID=$(id -g)
docker-compose "$@"

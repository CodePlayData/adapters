#!/bin/bash

./docker/docker_up.sh && \
    npm run test && \
    ./docker/docker_down.sh

if [ $? -ne 0 ]; then
    ./docker/docker_down.sh
fi
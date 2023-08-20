#!/bin/bash

./docker/docker_up.sh && \
    npm run test && \
    ./docker/docker_down.sh
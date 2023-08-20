#!/bin/bash

rm -rf .env

docker rm -f redis
docker rm -f fauna
docker rm -f mongodb
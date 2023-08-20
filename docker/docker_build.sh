#!/bin/bash
docker build -t my-mongodb -f ./docker/MongoDB.Dockerfile .
docker build -t my-faunadb -f ./docker/FaunaDB.Dockerfile .
docker build -t my-redis -f ./docker/Redis.Dockerfile .
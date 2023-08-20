#!/bin/bash

if [ -f .env ]; then
  source .env
fi

if [ -n "$FAUNA_COLLECTION" ]; then
  COLLECTION_NAME="$FAUNA_COLLECTION"
else
  COLLECTION_NAME="teste"
fi

if [ -n "$FAUNA_DATABASE" ]; then
  DATABASE_NAME="$FAUNA_DATABASE"
else
  DATABASE_NAME="db"
fi

docker run -d --name redis -p 6379:6379 -p 8001:8001 my-redis
docker run -d --name mongodb -p 27017:27017 my-mongodb
docker run -d --name fauna -p 8443:8443 -p 8084:8084 my-faunadb
sleep 15

# Execute o comando no contêiner e armazene o valor em FAUNA_SECRET
export FAUNA_SECRET=$(docker exec -it fauna bash -c \
  "fauna create-database $DATABASE_NAME && fauna create-key $DATABASE_NAME" \
  | grep "secret:" | awk '{print $2}')

sleep 20

docker exec -it fauna bash -c "fauna shell $DATABASE_NAME <<< 'CreateCollection({ name: \"$COLLECTION_NAME\" })'"

# Adicione a variável FAUNA_SECRET ao final do arquivo .env
if [ -n "$FAUNA_SECRET" ]; then
  echo "FAUNA_SECRET=$FAUNA_SECRET" >> .env
  echo "Variável FAUNA_SECRET adicionada ao arquivo .env"
else
  echo "Falha ao obter o segredo do FaunaDB"
fi
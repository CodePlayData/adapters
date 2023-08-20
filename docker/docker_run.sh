#!/bin/bash

if [ -f .env ]; then
  source .env
fi

docker run -d --name redis -p 6379:6379 -p 8001:8001 my-redis

docker run -d --name fauna -p 8443:8443 -p 8084:8084 my-faunadb
sleep 10

# Execute o comando no contêiner e armazene o valor em FAUNA_SECRET
export FAUNA_SECRET=$(docker exec -it fauna bash -c \
  "fauna create-database $FAUNA_DATABASE && fauna create-key $FAUNA_DATABASE" \
  | grep "secret:" | awk '{print $2}')

sleep 15

docker exec -it fauna bash -c "fauna shell $FAUNA_DATABASE <<< 'CreateCollection({ name: \"$FAUNA_COLLECTION\" })'"

# Adicione a variável FAUNA_SECRET ao final do arquivo .env
if [ -n "$FAUNA_SECRET" ]; then
  echo "FAUNA_SECRET=$FAUNA_SECRET" >> .env
  echo "Variável FAUNA_SECRET adicionada ao arquivo .env"
else
  echo "Falha ao obter o segredo do FaunaDB"
fi
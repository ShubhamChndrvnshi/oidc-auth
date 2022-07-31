#!/bin/bash
# mongoimport --uri="mongodb://$MONGO_INITDB_ROOT_USERNAME:$MONGO_INITDB_ROOT_PASSWORD@localhost:27017/auth?authSource=admin&ssl=false" --file="/docker-entrypoint-initdb.d/fixture/client.json" --jsonArray;
# mongoimport --uri="mongodb://$MONGO_INITDB_ROOT_USERNAME:$MONGO_INITDB_ROOT_PASSWORD@localhost:27017/auth?authSource=admin&ssl=false" --file="/docker-entrypoint-initdb.d/fixture/accounts.json" --jsonArray;
# mongoimport --uri="mongodb://$MONGO_INITDB_ROOT_USERNAME:$MONGO_INITDB_ROOT_PASSWORD@localhost:27017/auth?authSource=admin&ssl=false" --file="/docker-entrypoint-initdb.d/fixture/registration_access_token.json"  --jsonArray;
# mongo --eval "db.auth('$MONGO_INITDB_ROOT_USERNAME', '$MONGO_INITDB_ROOT_PASSWORD'); db = db.getSiblingDB('$MONGO_INITDB_DATABASE'); db.createUser({ user: '$MONGODB_USER', pwd: '$MONGODB_PASSWORD', roles: [{ role: 'readWrite', db: '$MONGODB_NAME' }] });";



MONGO_INITDB_ROOT_USERNAME=root
MONGO_INITDB_ROOT_PASSWORD=root
MONGO_INITDB_DATABASE=admin
MONGODB_USER=root
MONGODB_PASSWORD=root
MONGODB_NAME=auth
echo $MONGO_INITDB_ROOT_USERNAME
echo $PWD
mongoimport --uri="mongodb://$MONGO_INITDB_ROOT_USERNAME:$MONGO_INITDB_ROOT_PASSWORD@localhost:27017/auth?authSource=admin&ssl=false" --file="$PWD/fixture/db/client.json" --jsonArray;
mongoimport --uri="mongodb://$MONGO_INITDB_ROOT_USERNAME:$MONGO_INITDB_ROOT_PASSWORD@localhost:27017/auth?authSource=admin&ssl=false" --file="$PWD/fixture/db/accounts.json" --jsonArray;
mongoimport --uri="mongodb://$MONGO_INITDB_ROOT_USERNAME:$MONGO_INITDB_ROOT_PASSWORD@localhost:27017/auth?authSource=admin&ssl=false" --file="$PWD/fixture/db/registration_access_token.json"  --jsonArray;
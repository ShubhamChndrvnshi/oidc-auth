[![CI](https://github.com/thxprotocol/auth/actions/workflows/ci.yml/badge.svg)](https://github.com/thxprotocol/auth/actions/workflows/ci.yml)

# THX Auth

## Index

1. Prerequisites
2. Installing
3. Testing
4. Register clients
5. Interface
6. Database Schema Migration

## 1. Prerequisites

-   Docker
-   [NVM](https://github.com/nvm-sh/nvm)

We use docker to run our dependencies like mongo and ganache in. We run the development server locally, managing a common node version using Node Version Manager.
You can also manually install the correct node version but usage of NVM is recommended.

## 2. Installing

```
# 1. Install/activate current nodejs defined in .nvmrc
nvm use

# 2. Provide environment variables
cp .env.example .env

# 3. Create certificates (Make sure to have openssl@1.1 or openssl@3 installed.)
openssl req -x509 -newkey rsa:4096 -sha256 -days 3650 -nodes -keyout auth.key -out auth.crt -subj "/CN=localhost" -addext "subjectAltName=DNS:localhost"

# 3. Checkout SCSS submodule
git submodule init
git submodule update

# 4. Install packages
npm install --ci

# 5. Start working (docker compose up -d && npm run watch:debug)
npm run dev

# 6. shut down dependencies
docker compose down
```

## 3. Testing

```
# Run e2e tests
npm run test
```

## 4. Register clients

### 4.1 client_credentials example

```
POST http://localhost:3000/reg
{
    "application_type": "web",
    "client_name": "Your App",
    "grant_types": ["client_credentials"],
    "redirect_uris": [],
    "response_types": [],
    "scope": "openid account:read account:write asset_pools:read asset_pools:write rewards:read members:read members:write withdrawals:write"
}
```

### 4.2 authorization_code example

```
POST http://localhost:3000/reg
{
    "application_type": "web",
    "client_name": "THX Wallet",
    "grant_types": ["authorization_code"],
    "redirect_uris": ["https://dev.wallet.thx.network/signin-oidc"],
    "post_logout_redirect_uris": ["https://dev.wallet.thx.network"],
    "response_types": ["code"],
    "scope": "openid email offline_access deposits:read deposits:write asset_pools:read asset_pools:write rewards:read withdrawals:read"
}
```

## 5. Interface

Swagger Documentation is provided in the controllers of the routes and lives at the following endpoints:

-   [API Health](https://localhost:3000/v1/health/)
-   [Local API Specs](https://localhost:3000/v1/docs/)
-   [Staging API Specs](https://dev.api.thx.network/v1/docs/)
-   [Production API Specs](https://api.thx.network/v1/docs/)
-   [Developer Documentation](http://docs.thx.network)

## 5. Database Schema Migration

### 5.1 To add a new migration script, use the following CLI command

```
npm run migrate:create name-of-my-script
```

A new file will be created inside migrations folder with a corresponding timestamp.

```
|_ migrations/
   |- 20210108114324-name-of-my-script.js
```

### 5.2 To add a new property to the existing collection

Considering we want to add a quantity property to the products collection, the migration could be as follows:

```
export = {
    async up(db: Db) {
        return db.collection('products').updateMany({}, { $set: { quantity: 10 } });
    },

    async down(db: Db) {
        return db.collection('products').updateMany({}, { $unset: { quantity: null } });
    },
};
```

### 5.3 Running migrations

To get the migration status

```
npm run migrate:status
```

To run your migrations, simply run the command

```
npm run migrate
```

To rollback a migration use the down command

```
npm run migrate:undo-last
```

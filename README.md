# E-wallet APIs

E-wallet APIs is a NodeJS (ExpressJS) project that can help you to simulate an e-wallet in real life.

## Installation

Clone the repository:

```bash
git clone https://github.com/yoru-is-baam/e-wallet-api.git
cd e-wallet-api
```

Install the dependencies:

```bash
yarn install
```

## Commands

Running locally:

```bash
# seed data admin
yarn seed

# run dev server
yarn dev
```

## Environment Variables

The environment variables can be found and modified in the .env file. They come with these default values:

```dotenv
NODE_ENV=dev

DEV_APP_PORT=3052
DEV_DB_HOST=127.0.0.1
DEV_DB_PORT=27017
DEV_DB_NAME=walletDEV

PROD_APP_PORT=3000
PROD_DB_HOST=127.0.0.1
PROD_DB_PORT=27017
PROD_DB_NAME=walletPROD

# JWT secret key and lifetime
ACCESS_TOKEN_SECRET=thisisasamplesecret
ACCESS_TOKEN_LIFETIME=15m
REFRESH_TOKEN_SECRET=thisisanothersamplesecret
REFRESH_TOKEN_LIFETIME=30 days

COOKIE_SECRET=thisisasamplesecretcookie

# Email sending
SMTP_HOST=
SMTP_POST=
SMTP_USER=
SMTP_PASS=

# Cloudinary to store images
CLOUD_NAME=cloud-name
CLOUD_API_KEY=cloud-api-key
CLOUD_API_SECRET=cloud-api-secret

# Client url to send email reset password
CLIENT_URL=
```

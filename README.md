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
yarn dev
```

## Environment Variables

The environment variables can be found and modified in the .env file. They come with these default values:

```dotenv
# URI of your local MongoDB or MongoDB Atlas
MONGO_URI=mongodb://127.0.0.1:27017/e-wallet

# JWT secret key and lifetime
ACCESS_TOKEN_SECRET=thisisasamplesecret
ACCESS_TOKEN_LIFETIME=15m
REFRESH_TOKEN_SECRET=thisisanothersamplesecret
REFRESH_TOKEN_LIFETIME=30 days

COOKIE_SECRET=thisisasamplesecretcookie

# Email sending
EMAIL_ADMIN=email-admin
PASS_ADMIN=code-password-admin

# Cloudinary to store images
CLOUD_NAME=cloud-name
CLOUD_API_KEY=cloud-api-key
CLOUD_API_SECRET=cloud-api-secret
```

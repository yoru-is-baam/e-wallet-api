"use strict";

const dev = {
	app: {
		port: process.env.DEV_APP_PORT || 3052,
	},
	db: {
		host: process.env.DEV_DB_HOST || "127.0.0.1",
		port: process.env.DEV_DB_PORT || 27017,
		name: process.env.DEV_DB_NAME || "walletDEV",
	},
};

const prod = {
	app: {
		port: process.env.PROD_APP_PORT || 3000,
	},
	db: {
		host: process.env.PROD_DB_HOST || "127.0.0.1",
		port: process.env.PROD_DB_PORT || 27017,
		name: process.env.PROD_DB_NAME || "walletPROD",
	},
};

const config = { dev, prod };

const env = process.env.NODE_ENV || "dev";

export default config[env];

const { createJWT, isTokenValid } = require("./jwt");
const {
	generateUsername,
	generateNumericalString,
	generateRandomString,
} = require("./generate-random-string");
const createTokenUser = require("./create-token-user");
const createAdminAccount = require("./create-admin-account");
const checkPermissions = require("./check-permissions");
const attachCookiesToResponse = require("./create-response-cookie");

module.exports = {
	checkPermissions,
	createAdminAccount,
	createJWT,
	isTokenValid,
	attachCookiesToResponse,
	createTokenUser,
	generateUsername,
	generateNumericalString,
	generateRandomString,
};

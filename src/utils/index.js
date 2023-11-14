const { createJWT, isTokenValid } = require("./jwt");
const {
	generateUsername,
	generateNumericalString,
	generateRandomString,
} = require("./generate-random-string");
const createPayload = require("./create-payload");
const createAdminAccount = require("./create-admin-account");
const checkPermissions = require("./check-permissions");
const attachCookiesToResponse = require("./create-response-cookie");

module.exports = {
	checkPermissions,
	createAdminAccount,
	createJWT,
	isTokenValid,
	attachCookiesToResponse,
	createPayload,
	generateUsername,
	generateNumericalString,
	generateRandomString,
};

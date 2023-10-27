function generateNumericalString(length) {
	return generateRandomStringWithPattern("0123456789", length);
}

function generateRandomString(length) {
	return generateRandomStringWithPattern(
		"0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
		length
	);
}

function generateRandomStringWithPattern(chars, length) {
	let randomString = "";

	for (let i = 0; i < length; i++) {
		randomString += chars[Math.floor(Math.random() * chars.length)];
	}

	return randomString;
}

async function generateUsername() {
	const User = require("../models/User");

	let username = "";
	let isExisted = false;

	do {
		username = generateNumericalString(10);
		isExisted = await User.exists({ username });
	} while (isExisted);

	return username;
}

module.exports = {
	generateUsername,
	generateRandomString,
	generateNumericalString,
};

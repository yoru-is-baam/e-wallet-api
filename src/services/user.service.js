const { User } = require("../models");
const CustomError = require("../errors");
const { generateRandomString, generateUsername } = require("../utils");

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
	if (await checkFieldExistence({ email: userBody.email })) {
		throw new CustomError.BadRequestError("ValidationError", {
			email: "Email already exists",
		});
	}

	if (await checkFieldExistence({ phone: userBody.phone })) {
		throw new CustomError.BadRequestError("ValidationError", {
			phone: "Phone number already exists",
		});
	}

	// create user account
	const username = await generateUsername(User);
	const password = generateRandomString(6);

	return User.create({
		username,
		password,
		profile: userBody,
	});
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
	return User.findById(id);
};

/**
 * Get user by username
 * @param {string} username
 * @returns {Promise<User>}
 */
const getUserByUsername = async (username) => {
	return User.findOne({ username });
};

/**
 * Check user existence by a specific field
 * @param {string} field
 * @returns {Promise<Boolean>}
 */
const checkFieldExistence = async (field, excludeUserId) => {
	const isExisted = await User.isFieldTaken(field, excludeUserId);
	return isExisted;
};

// update fresh token
const updateRefreshTokenByUsername = async (username, newRefreshToken) => {
	await User.findOneAndUpdate({ username }, { refreshToken: newRefreshToken });
};

const updateRefreshTokenByOldRefreshToken = async (
	oldRefreshToken,
	newRefreshToken
) => {
	await User.findOneAndUpdate(
		{ refreshToken: oldRefreshToken },
		{ refreshToken: newRefreshToken }
	);
};

const updateRefreshTokenStrategies = {
	username: updateRefreshTokenByUsername,
	refreshToken: updateRefreshTokenByOldRefreshToken,
};

const updateRefreshToken = async (obj, newRefreshToken) => {
	const [key, value] = Object.entries(obj)[0];
	await updateRefreshTokenStrategies[key](value, newRefreshToken);
};

/**
 * Get users with filters
 * @param {Object} filters - status, sort, wrongCount,....
 * @returns {Promise<User>}
 */
const getUsers = async (filters) => {
	const { status, sort, wrongCount, unusualLogin } = filters;
	const filterObject = {};

	if (status) {
		filterObject.status = status;
	}

	if (wrongCount) {
		filterObject.wrongCount = wrongCount;
	}

	if (unusualLogin) {
		filterObject.unusualLogin = unusualLogin === "true" ? true : false;
	}

	// just get user
	filterObject.role = "user";

	let result = User.find(filterObject).select("-password -otp");

	// sort (can re-use)
	if (sort) {
		const sortList = sort.split(",").join(" ");
		result = result.sort(sortList);
	} else {
		result = result.sort("createdAt");
	}

	// pagination (can re-use)
	const page = Number(filters.page) || 1;
	const limit = Number(filters.limit) || 10;
	const skip = (page - 1) * limit;

	result = result.skip(skip).limit(limit);

	const users = await result;

	return users;
};

module.exports = {
	createUser,
	getUsers,
	getUserById,
	getUserByUsername,
	checkFieldExistence,
	updateRefreshToken,
};

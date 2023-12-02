import userService from "./user.service.js";
import CustomError from "../errors/index.js";

/**
 * Login with username and password
 * @param {string} username
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginWithUsernameAndPassword = async (username, password) => {
	const user = await userService.getUserByUsername(username);
	if (!user) {
		throw new CustomError.UnauthenticatedError("ValidationError", {
			username: "username is invalid",
		});
	}

	// admin will not be checked this
	if (user.role === "user") {
		const FIRST_WRONG_LIMIT = 3;
		const SECOND_WRONG_LIMIT = 6;
		const ONE_MINUTE = 60000;
		const currentTime = Date.now();
		const blockedTime = currentTime - user.blockedTime;

		if (user.wrongCount >= FIRST_WRONG_LIMIT && blockedTime < ONE_MINUTE) {
			throw new CustomError.UnauthorizedError(
				"PermissionError",
				null,
				"Your account is blocked, please try again after 1 minute"
			);
		} else if (user.wrongCount >= SECOND_WRONG_LIMIT && user.unusualLogin) {
			throw new CustomError.UnauthorizedError(
				"PermissionError",
				null,
				"Your account is blocked because wrong many times, please contact administrator"
			);
		}
	}

	const isPasswordCorrect = await user.comparePassword(password);
	if (!isPasswordCorrect) {
		// admin will not be increased wrong count
		if (user.role === "user") {
			await user.updateWrongCount();
		}

		throw new CustomError.UnauthenticatedError("password is invalid");
	} else if (user.wrongCount > 0) {
		// If correct, then check wrong count and restore
		await user.restoreLoginStatus();
	}

	return user;
};

export default { loginWithUsernameAndPassword };

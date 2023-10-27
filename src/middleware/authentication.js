const CustomError = require("../errors");
const { isTokenValid } = require("../utils");

const authenticateUser = async (req, res, next) => {
	const token = req.signedCookies.token;

	if (!token) {
		throw new CustomError.UnauthenticatedError("Authentication Invalid");
	}

	try {
		const { name, userId, status, role } = isTokenValid({ token });
		req.user = { name, userId, status, role };
		next();
	} catch (error) {
		throw new CustomError.UnauthenticatedError("Authentication Invalid");
	}
};

const authorizePermissions = (...roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.user.role)) {
			throw new CustomError.UnauthorizedError(
				"Unauthorized to access this route"
			);
		}
		next();
	};
};

const authenticateFirstLoginUser = (req, res, next) => {
	const { status } = req.user;

	if (status === "verified") {
		throw new CustomError.UnauthenticatedError("Your account already verified");
	} else if (status === "pending") {
		throw new CustomError.UnauthenticatedError("Your account is pending");
	} else if (status === "disabled") {
		throw new CustomError.UnauthenticatedError("Your account is disabled");
	} else if (status === "waiting update") {
		throw new CustomError.UnauthenticatedError(
			"Your account is waiting update"
		);
	}

	next();
};

module.exports = {
	authenticateUser,
	authenticateFirstLoginUser,
	authorizePermissions,
};

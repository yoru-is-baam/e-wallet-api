const CustomError = require("../errors");
const { isTokenValid } = require("../utils");

const authenticateUser = async (req, res, next) => {
	let accessToken;
	const authHeader = req.headers.authorization;
	if (authHeader && authHeader.startsWith("Bearer ")) {
		accessToken = authHeader.split(" ")[1];
	}

	if (!accessToken) {
		throw new CustomError.UnauthenticatedError(
			"TokenError",
			null,
			"No access token found"
		);
	}

	try {
		const { name, userId, status, role } = isTokenValid(
			accessToken,
			"accessToken"
		);
		req.user = { name, userId, status, role };
		next();
	} catch (error) {
		throw new CustomError.UnauthenticatedError(
			"TokenExpiredError",
			null,
			"Invalid access token"
		);
	}
};

const authorizePermissions = (...roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.user.role)) {
			throw new CustomError.UnauthorizedError(
				"PermissionError",
				null,
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

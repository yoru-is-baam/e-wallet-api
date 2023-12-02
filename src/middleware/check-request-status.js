import CustomError from "../errors/index.js";

// Check route enter OTP, reset password
const checkRequestStatus = (status) => async (req, res, next) => {
	if (!req.signedCookies.user || req.signedCookies.user.status !== status) {
		throw new CustomError.UnauthorizedError(
			"PermissionError",
			null,
			"Can not access this route"
		);
	}

	next();
};

export default checkRequestStatus;

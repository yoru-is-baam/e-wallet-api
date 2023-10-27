const CustomError = require("../errors");

// Check route enter OTP, reset password
const checkRequestStatus = (status) => async (req, res, next) => {
	if (!req.signedCookies.user || req.signedCookies.user.status !== status) {
		throw new CustomError.UnauthorizedError("Can not access this route");
	}

	next();
};

module.exports = checkRequestStatus;

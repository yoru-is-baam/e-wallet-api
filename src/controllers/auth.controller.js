const {
	userService,
	walletService,
	mailService,
	authService,
} = require("../services");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const {
	createJWT,
	createPayload,
	verifyToken,
	attachCookiesToResponse,
} = require("../utils");

const register = async (req, res) => {
	const user = await userService.createUser(req.body);
	await walletService.createWallet(user._id);

	// send mail
	mailService.sendEmail(
		user.profile.email,
		"Your account ✔",
		`<p>Username: ${user.username}</p><p>Password: ${user.password}</p>`
	);

	// jwt & cookies
	const payload = createPayload(user);
	const accessToken = createJWT(payload, "accessToken");

	res
		.status(StatusCodes.CREATED)
		.json({ status: "success", data: { user: payload, accessToken } });
};

const login = async (req, res) => {
	const { username, password } = req.body;

	const user = await authService.loginWithUsernameAndPassword(
		username,
		password
	);

	// jwt & cookies
	const payload = createPayload(user);
	const accessToken = createJWT(payload, "accessToken");
	const refreshToken = createJWT(payload, "refreshToken");
	attachCookiesToResponse({
		res,
		cookie: { key: "refreshToken", value: refreshToken },
	});

	await userService.updateRefreshToken({ username }, refreshToken);

	res
		.status(StatusCodes.OK)
		.json({ status: "success", data: { user: payload, accessToken } });
};

const logout = async (req, res) => {
	const refreshToken = req.signedCookies?.refreshToken;
	await userService.updateRefreshToken({ refreshToken }, null);

	res.clearCookie("refreshToken");

	res.status(StatusCodes.NO_CONTENT).json({ status: "success", data: null });
};

const refreshToken = async (req, res) => {
	const refreshToken = req.signedCookies?.refreshToken;
	if (!refreshToken) {
		throw new CustomError.UnauthenticatedError(
			"TokenError",
			null,
			"No refresh token found"
		);
	}

	const isExisted = await userService.checkFieldExistence(refreshToken);
	if (!isExisted) {
		throw new CustomError.UnauthenticatedError(
			"TokenError",
			null,
			"No user found with this refresh token"
		);
	}

	try {
		const { userId, name, status, role } = verifyToken({ refreshToken });
		const payload = { userId, name, status, role };
		const newAccessToken = createJWT(payload, "accessToken");
		const newRefreshToken = createJWT(payload, "refreshToken");
		attachCookiesToResponse({
			res,
			cookie: { key: "refreshToken", value: newRefreshToken },
		});

		await userService.updateRefreshToken({ refreshToken }, newRefreshToken);

		res
			.status(StatusCodes.OK)
			.json({ status: "success", data: { accessToken: newAccessToken } });
	} catch (error) {
		await userService.updateRefreshToken({ refreshToken }, null);

		res.clearCookie("refreshToken");

		throw new CustomError.UnauthenticatedError(
			"TokenExpiredError",
			null,
			"Invalid refresh token"
		);
	}
};

module.exports = { register, login, logout, refreshToken };

const User = require("../models/User");
const Wallet = require("../models/Wallet");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const {
	createJWT,
	generateRandomString,
	generateUsername,
	createTokenUser,
	attachCookiesToResponse,
} = require("../utils");

const MailService = require("../services/mail.service");
const mailService = MailService.getInstance();

const register = async (req, res) => {
	const { email, phone, name, birth, address } = req.body;

	const emailOrPhoneAlreadyExists = await User.findOne({
		$or: [{ profile: { email } }, { profile: { phone } }],
	});
	if (emailOrPhoneAlreadyExists) {
		throw new CustomError.BadRequestError(
			"Email or phone number already exists"
		);
	}

	// create user account
	const username = await generateUsername();
	const password = generateRandomString(6);

	const user = await User.create({
		username,
		password,
		profile: {
			phone,
			email,
			name,
			birth,
			address,
		},
	});

	// create wallet
	await Wallet.create({ userId: user._id });

	// send mail
	mailService.sendEmail(
		`Administrator 👻 <${process.env.EMAIL_ADMIN}>`,
		email,
		"Your account ✔",
		`<p>Username: ${username}</p><p>Password: ${password}</p>`
	);

	// jwt & cookies
	const payload = createTokenUser(user);
	const token = createJWT(payload);
	const oneDay = 1000 * 60 * 60 * 24;
	attachCookiesToResponse({
		res,
		cookie: { key: "token", value: token, time: oneDay },
	});

	res.status(StatusCodes.CREATED).json({ user: payload });
};

const login = async (req, res) => {
	const { username, password } = req.body;

	const user = await User.findOne({ username });
	if (!user) {
		throw new CustomError.UnauthenticatedError("username is invalid");
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
				"Your account is blocked, please try again after 1 minute"
			);
		} else if (user.wrongCount >= SECOND_WRONG_LIMIT && user.unusualLogin) {
			throw new CustomError.UnauthorizedError(
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

	// jwt & cookies
	const payload = createTokenUser(user);
	const token = createJWT(payload);
	const oneDay = 1000 * 60 * 60 * 24;
	attachCookiesToResponse({
		res,
		cookie: { key: "token", value: token, time: oneDay },
	});

	res.status(StatusCodes.OK).json({ status: "success", user: payload });
};

const logout = async (req, res) => {
	res.cookie("token", "logout", {
		httpOnly: true,
		expires: new Date(Date.now() + 1000),
	});

	res
		.status(StatusCodes.OK)
		.json({ status: "success", message: "user logged out!" });
};

module.exports = { register, login, logout };

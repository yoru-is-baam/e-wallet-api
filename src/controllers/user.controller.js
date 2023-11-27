const User = require("../models/User");
const Wallet = require("../models/Wallet");

const {
	checkPermissions,
	attachCookiesToResponse,
	generateNumericalString,
} = require("../utils");

const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");

const cloudinary = require("../configs/cloudinary.config");

const MailService = require("../services/mail.service");
const mailService = MailService.getInstance();

const getUsers = async (req, res) => {
	const { status, sort, wrongCount, unusualLogin } = req.query;
	const queryObject = {};

	if (status) {
		queryObject.status = status;
	}

	if (wrongCount) {
		queryObject.wrongCount = wrongCount;
	}

	if (unusualLogin) {
		queryObject.unusualLogin = unusualLogin === "true" ? true : false;
	}

	// just get user
	queryObject.role = "user";

	let result = User.find(queryObject).select("-password -otp");

	// sort (can re-use)
	if (sort) {
		const sortList = sort.split(",").join(" ");
		result = result.sort(sortList);
	} else {
		result = result.sort("createdAt");
	}

	// pagination (can re-use)
	const page = Number(req.query.page) || 1;
	const limit = Number(req.query.limit) || 10;
	const skip = (page - 1) * limit;

	result = result.skip(skip).limit(limit);

	const users = await result;

	res
		.status(StatusCodes.OK)
		.json({ status: "success", data: { nbHits: users.length, users } });
};

const getUser = async (req, res) => {
	let user = await User.findById(req.params.id);

	if (!user) {
		throw new CustomError.NotFoundError(
			"ValueError",
			null,
			"No user found with id: " + req.params.id
		);
	}

	checkPermissions(req.user, user._id);

	// get wallet
	const wallet = await Wallet.findOne({ userId: req.params.id });

	// filter fields
	user = { ...user.profile, status: user.status, balance: wallet.balance };

	res.status(StatusCodes.OK).json({ status: "success", data: { user } });
};

const unlockBlockedAccount = async (req, res) => {
	const user = await User.findById(req.body.userId);

	if (user) {
		await user.restoreLoginStatus();

		res.status(StatusCodes.OK).json({
			status: "success",
			data: null,
		});
	} else {
		throw new CustomError.NotFoundError(
			"ValueError",
			null,
			"No user found with id: " + req.body.userId
		);
	}
};

const activateAccount = async (req, res) => {
	const { status } = req.body;
	const user = await User.findByIdAndUpdate(
		req.body.userId,
		{ status },
		{ runValidators: true }
	);

	if (user) {
		res.status(StatusCodes.OK).json({
			status: "success",
			data: null,
		});
	} else {
		throw new CustomError.NotFoundError(
			"ValueError",
			null,
			"No user found with id: " + req.body.userId
		);
	}
};

const resetPasswordPost = async (req, res) => {
	const { email, phone } = req.body;
	const user = await User.findOne({ "profile.email": email });

	if (!user) {
		throw new CustomError.NotFoundError("ValidationError", {
			email: "No email found",
		});
	}

	if (user.profile.phone !== phone) {
		throw new CustomError.NotFoundError("ValidationError", {
			phone: "No phone number found",
		});
	}

	// send OTP
	mailService.sendEmail(
		`Administrator 👻 <${process.env.EMAIL_ADMIN}>`,
		email,
		"Your OTP ✔",
		`<p>${user.otp}</p>`
	);

	const ONE_DAY = 1000 * 60 * 60 * 24;
	attachCookiesToResponse({
		res,
		cookie: {
			key: "user",
			value: { email, status: "Enter OTP" },
			lifetime: ONE_DAY,
		},
	});

	res.status(StatusCodes.OK).json({ status: "success", data: null });
};

const enterOTP = async (req, res) => {
	const { email } = req.signedCookies.user;

	const user = await User.findOne({ "profile.email": email });
	// if true, meaning cookie was changed
	if (!user) {
		throw new CustomError.BadRequestError(
			"ValueError",
			null,
			"Invalid credentials"
		);
	}

	if (user.otp != req.body.otp) {
		throw new CustomError.UnauthenticatedError("ValidationError", {
			otp: "Wrong OTP",
		});
	}

	// update new OTP
	user.otp = generateNumericalString(6);
	await user.save();

	// keep track reset status
	const ONE_DAY = 1000 * 60 * 60 * 24;
	attachCookiesToResponse({
		res,
		cookie: {
			key: "user",
			value: { email, status: "Reset password" },
			lifetime: ONE_DAY,
		},
	});

	res.status(StatusCodes.OK).json({ status: "success", data: null });
};

const resetPasswordPatch = async (req, res) => {
	const { email } = req.signedCookies.user;
	const { newPassword } = req.body;

	const user = await User.findOne({ "profile.email": email });
	// if true, meaning cookie was changed
	if (!user) {
		throw new CustomError.BadRequestError(
			"ValueError",
			null,
			"Invalid credentials"
		);
	}

	// update password
	user.password = newPassword;
	await user.save();

	// remove status cookie
	res.clearCookie("user");
	// res.cookie("user", "", {
	// 	httpOnly: true,
	// 	expires: new Date(Date.now() + 1000),
	// });

	res.status(StatusCodes.OK).json({ status: "success", data: null });
};

const changePassword = async (req, res) => {
	const { oldPassword, newPassword } = req.body;
	const user = await User.findById(req.user.userId);

	const isPasswordCorrect = await user.comparePassword(oldPassword);
	if (!isPasswordCorrect) {
		throw new CustomError.UnauthenticatedError("ValidationError", {
			oldPassword: "Wrong old password",
		});
	}

	user.password = newPassword;

	await user.save();

	res.status(StatusCodes.OK).json({
		status: "success",
		data: null,
	});
};

const updateID = async (req, res) => {
	// NEED-TO-BE-FIXED: DO NOT UPLOAD TO CLOUDINARY WHEN ONE OF TWO FILES IS EMPTY
	const { idFront, idBack } = req.files;

	if (!idFront || !idBack) {
		Promise.all([
			idFront?.[0] && cloudinary.uploader.destroy(idFront[0].filename),
			idBack?.[0] && cloudinary.uploader.destroy(idBack[0].filename),
		]);

		throw new CustomError.BadRequestError("ValidationError", {
			idFront: "ID can not be empty",
			idBack: "ID can not be empty",
		});
	}

	const idPath = {
		idFront: req.files.idFront[0].filename,
		idBack: req.files.idBack[0].filename,
	};

	await User.findByIdAndUpdate(
		req.user.userId,
		{ "profile.idPath": idPath },
		{ new: true }
	);

	res.status(StatusCodes.OK).json({ status: "success", data: null });
};

const removeID = async (req, res) => {
	const { idPath } = req.body;
	await cloudinary.uploader.destroy(idPath.idFront);
	await cloudinary.uploader.destroy(idPath.idBack);

	res.status(StatusCodes.OK).json({ status: "success", data: null });
};

module.exports = {
	getUsers,
	getUser,
	unlockBlockedAccount,
	activateAccount,
	changePassword,
	resetPasswordPost,
	enterOTP,
	resetPasswordPatch,
	updateID,
	removeID,
};

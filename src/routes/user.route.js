const express = require("express");
const router = express.Router();

const UserController = require("../controllers/user.controller");
const { multerUploader } = require("../configs/multer.config");

const {
	authenticateUser,
	authorizePermissions,
} = require("../middleware/authentication");
const {
	changePasswordValidationMiddleware,
	resetPasswordPostValidationMiddleware,
	otpValidationMiddleware,
	passwordValidationMiddleware,
} = require("../middleware/validation");
const checkRequestStatus = require("../middleware/check-request-status");

router
	.route("/")
	.get(
		[authenticateUser, authorizePermissions("admin")],
		UserController.getUsers
	);

router.get("/:id", authenticateUser, UserController.getProfile);

router.patch(
	"/activate",
	[authenticateUser, authorizePermissions("admin")],
	UserController.activateAccount
);

router.patch(
	"/unlock-blocked-account",
	[authenticateUser, authorizePermissions("admin")],
	UserController.unlockBlockedAccount
);

router.patch(
	"/change-password",
	[authenticateUser, changePasswordValidationMiddleware],
	UserController.changePassword
);

router
	.route("/reset-password")
	.post(resetPasswordPostValidationMiddleware, UserController.resetPasswordPost)
	.patch(
		[checkRequestStatus("Reset password"), passwordValidationMiddleware],
		UserController.resetPasswordPatch
	);

router.post(
	"/enter-otp",
	[checkRequestStatus("Enter OTP"), otpValidationMiddleware],
	UserController.enterOTP
);

router.patch(
	"/update-id",
	authenticateUser,
	multerUploader.fields([
		{ name: "idFront", maxCount: 1 },
		{ name: "idBack", maxCount: 1 },
	]),
	UserController.updateID
);

router.delete(
	"/remove-id",
	[authenticateUser, authorizePermissions("admin")],
	UserController.removeID
);

module.exports = router;

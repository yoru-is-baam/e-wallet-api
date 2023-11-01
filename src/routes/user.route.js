const express = require("express");
const router = express.Router();

const UserController = require("../controllers/user.controller");
const UserValidation = require("../validations/user.validation");

const { multerUploader } = require("../configs/multer.config");

const {
	authenticateUser,
	authorizePermissions,
} = require("../middleware/authentication");
const checkRequestStatus = require("../middleware/check-request-status");

router
	.route("/")
	.get(
		[authenticateUser, authorizePermissions("admin")],
		UserController.getUsers
	);

router.get("/:id", authenticateUser, UserController.getUser);

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
	[authenticateUser, UserValidation.changePasswordValidationMiddleware],
	UserController.changePassword
);

router
	.route("/reset-password")
	.post(
		UserValidation.resetPasswordPostValidationMiddleware,
		UserController.resetPasswordPost
	)
	.patch(
		[
			checkRequestStatus("Reset password"),
			UserValidation.resetPasswordPatchValidationMiddleware,
		],
		UserController.resetPasswordPatch
	);

router.post(
	"/enter-otp",
	[checkRequestStatus("Enter OTP"), UserValidation.otpValidationMiddleware],
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

import express from "express";
const router = express.Router();

import UserController from "../controllers/user.controller.js";
import UserValidation from "../validations/user.validation.js";

import { multerUploader } from "../configs/multer.config.js";

import { authenticateUser, authorizePermissions } from "../middleware/authentication.js";
import checkRequestStatus from "../middleware/check-request-status.js";

router.route("/").get([authenticateUser, authorizePermissions("admin")], UserController.getUsers);

router.get("/:id", authenticateUser, UserController.getUser);

router.patch("/activate", [authenticateUser, authorizePermissions("admin")], UserController.activateAccount);

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
	.post(UserValidation.resetPasswordPostValidationMiddleware, UserController.resetPasswordPost)
	.patch(
		[checkRequestStatus("Reset password"), UserValidation.resetPasswordPatchValidationMiddleware],
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
		{ name: "idBack", maxCount: 1 }
	]),
	UserController.updateID
);

router.delete("/remove-id", [authenticateUser, authorizePermissions("admin")], UserController.removeID);

export default router;

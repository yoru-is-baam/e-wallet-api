import { Router } from "express";
const router = Router();

import AuthValidation from "../../validations/auth.validation.js";
import ParamValidation from "../../validations/param.validation.js";
import QueryValidation from "../../validations/query.validation.js";

import AuthController from "../../controllers/auth.controller.js";
import Authentication from "../../middlewares/authentication.js";

router.post(
	"/register",
	[AuthValidation.registerValidationMiddleware],
	AuthController.register,
);

router.post(
	"/login",
	[AuthValidation.loginValidationMiddleware],
	AuthController.loginWithEmailAndPassword,
);

router.post("/refresh-token", AuthController.refreshToken);

router.post(
	"/forgot-password",
	[AuthValidation.forgotPasswordValidationMiddleware],
	AuthController.forgotPassword,
);

router.patch(
	"/reset-password",
	[AuthValidation.resetPasswordValidationMiddleware],
	AuthController.resetPassword,
);

router.use(Authentication.authenticateToken);

router.post("/logout", AuthController.logout);

router.patch(
	"/change-password",
	[AuthValidation.changePasswordValidationMiddleware],
	AuthController.changePassword,
);

export default router;

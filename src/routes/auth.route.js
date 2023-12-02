import { Router } from "express";
const router = Router();

import AuthValidation from "../validations/auth.validation.js";
import AuthController from "../controllers/auth.controller.js";

router.post(
	"/register",
	AuthValidation.registerValidationMiddleware,
	AuthController.register
);
router.post(
	"/login",
	AuthValidation.loginValidationMiddleware,
	AuthController.login
);
router.post("/logout", AuthController.logout);
router.post("/refresh-token", AuthController.refreshToken);

export default router;

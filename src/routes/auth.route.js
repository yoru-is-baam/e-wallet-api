const express = require("express");
const router = express.Router();

const AuthValidation = require("../validations/auth.validation");
const AuthController = require("../controllers/auth.controller");

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

module.exports = router;

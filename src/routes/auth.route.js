const express = require("express");
const router = express.Router();

const AuthValidation = require("../validations/auth.validation");

const { register, login, logout } = require("../controllers/auth.controller");

router.post("/register", AuthValidation.registerValidationMiddleware, register);
router.post("/login", AuthValidation.loginValidationMiddleware, login);
router.post("/logout", logout);

module.exports = router;

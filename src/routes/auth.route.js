const express = require("express");
const router = express.Router();

const {
	registerValidationMiddleware,
	loginValidationMiddleware,
} = require("../middleware/validation");
const { register, login, logout } = require("../controllers/auth.controller");

router.post("/register", registerValidationMiddleware, register);
router.post("/login", loginValidationMiddleware, login);
router.post("/logout", logout);

module.exports = router;

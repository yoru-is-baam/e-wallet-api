const Joi = require("joi");
const validationMiddleware = require("./validation");

const changePasswordSchema = Joi.object({
	oldPassword: Joi.string().required().min(6).trim().strict(),
	newPassword: Joi.string().required().min(6).trim().strict(),
	confirmPassword: Joi.string()
		.required()
		.trim()
		.strict()
		.valid(Joi.ref("newPassword")),
});

const resetPasswordPostSchema = Joi.object({
	email: Joi.string().required().email().trim().strict(),
	phone: Joi.string()
		.required()
		.trim()
		.strict()
		.regex(/(84|0[3|5|7|8|9])+([0-9]{8})\b/)
		.message("phone number must be a valid number"),
});

const otpSchema = Joi.object({
	otp: Joi.string().required().min(6).trim().strict(),
});

const resetPasswordPatchSchema = Joi.object({
	newPassword: Joi.string().required().min(6).trim().strict(),
});

module.exports = {
	changePasswordValidationMiddleware:
		validationMiddleware(changePasswordSchema),
	resetPasswordPostValidationMiddleware: validationMiddleware(
		resetPasswordPostSchema
	),
	otpValidationMiddleware: validationMiddleware(otpSchema),
	resetPasswordPatchValidationMiddleware: validationMiddleware(
		resetPasswordPatchSchema
	),
};

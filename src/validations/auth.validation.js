import Joi from "joi";
import Validation from "../middlewares/validation.js";
import joiObjectId from "joi-objectid";

Joi.objectId = joiObjectId(Joi);

const registerSchema = Joi.object({
	email: Joi.string().required().email().trim().strict(),
	phone: Joi.string()
		.required()
		.trim()
		.strict()
		.regex(/(84|0[3|5|7|8|9])+([0-9]{8})\b/)
		.message("phone number must be a valid number"),
	name: Joi.string().required().trim().strict(),
	birth: Joi.date().required(),
	address: Joi.string().required().trim().strict(),
});

const loginSchema = Joi.object({
	email: Joi.string().required().email().trim().strict(),
	password: Joi.string()
		.required()
		.min(6)
		.trim()
		.strict()
		.error((errors) => {
			errors.forEach((err) => {
				switch (err.code) {
					case "string.min":
						err.message = "password is invalid";
						break;
					default:
						break;
				}
			});
			return errors;
		}),
});

const changePasswordSchema = Joi.object({
	oldPassword: Joi.string().required().min(6).trim().strict(),
	newPassword: Joi.string().required().min(6).trim().strict(),
	confirmPassword: Joi.string()
		.required()
		.trim()
		.strict()
		.valid(Joi.ref("newPassword")),
}).messages({
	"any.only": "Passwords does not match",
});

const forgotPasswordSchema = Joi.object({
	email: Joi.string().required().email().trim().strict(),
	phone: Joi.string()
		.required()
		.trim()
		.strict()
		.regex(/(84|0[3|5|7|8|9])+([0-9]{8})\b/)
		.message("phone number must be a valid number"),
});

const verifyOtpSchema = Joi.object({
	otp: Joi.string().required().min(6).trim().strict(),
});

const resetPasswordSchema = Joi.object({
	userId: Joi.objectId().required(),
	token: Joi.string().required().trim().strict(),
	newPassword: Joi.string().required().min(6).trim().strict(),
	confirmPassword: Joi.string()
		.required()
		.trim()
		.strict()
		.valid(Joi.ref("newPassword")),
}).messages({
	"any.only": "Passwords does not match",
});

export default {
	registerValidationMiddleware:
		Validation.bodyValidationMiddleware(registerSchema),
	loginValidationMiddleware: Validation.bodyValidationMiddleware(loginSchema),
	changePasswordValidationMiddleware:
		Validation.bodyValidationMiddleware(changePasswordSchema),
	forgotPasswordValidationMiddleware:
		Validation.bodyValidationMiddleware(forgotPasswordSchema),
	verifyOtpValidationMiddleware:
		Validation.bodyValidationMiddleware(verifyOtpSchema),
	resetPasswordValidationMiddleware:
		Validation.bodyValidationMiddleware(resetPasswordSchema),
};

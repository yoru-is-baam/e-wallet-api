const joi = require("joi");
const CustomError = require("../errors");

const registerSchema = joi.object({
	email: joi.string().required().email(),
	phone: joi
		.string()
		.required()
		.regex(/(84|0[3|5|7|8|9])+([0-9]{8})\b/)
		.message("phone number must be a valid number"),
	name: joi.string().required(),
	birth: joi.date().required(),
	address: joi.string().required(),
});

const loginSchema = joi.object({
	username: joi.string().required(),
	password: joi.string().required(),
});

const changePasswordSchema = joi.object({
	oldPassword: joi.string().required().min(6),
	newPassword: joi.string().required().min(6),
	confirmPassword: joi.string().required().valid(joi.ref("newPassword")),
});

const resetPasswordPostSchema = joi.object({
	email: joi.string().required().email(),
	phone: joi
		.string()
		.required()
		.regex(/(84|0[3|5|7|8|9])+([0-9]{8})\b/)
		.message("phone number must be a valid number"),
});

const otpSchema = joi.object({
	otp: joi.string().required().min(6),
});

const passwordSchema = joi.object({
	newPassword: joi.string().required().min(6),
});

const validationMiddleware = (schema) => (req, res, next) => {
	const { error, value } = schema.validate(req.body, {
		abortEarly: false,
		errors: { label: "key", wrap: { label: false } },
	});

	if (!error) {
		next();
	} else {
		const errMsg = error.details.map((item) => item.message).join(",");
		throw new CustomError.BadRequestError(errMsg);
	}
};

module.exports = {
	registerValidationMiddleware: validationMiddleware(registerSchema),
	loginValidationMiddleware: validationMiddleware(loginSchema),
	changePasswordValidationMiddleware:
		validationMiddleware(changePasswordSchema),
	resetPasswordPostValidationMiddleware: validationMiddleware(
		resetPasswordPostSchema
	),
	otpValidationMiddleware: validationMiddleware(otpSchema),
	passwordValidationMiddleware: validationMiddleware(passwordSchema),
};

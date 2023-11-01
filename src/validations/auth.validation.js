const Joi = require("joi");
const validationMiddleware = require("./validation");

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
	username: Joi.string().required().trim().strict(),
	password: Joi.string().required().trim().strict(),
});

module.exports = {
	registerValidationMiddleware: validationMiddleware(registerSchema),
	loginValidationMiddleware: validationMiddleware(loginSchema),
};

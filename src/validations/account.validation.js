import Joi from "joi";
import Validation from "../middlewares/validation.js";
import { STATUS } from "../common/constants/index.js";

const activateAccountSchema = Joi.object({
	status: Joi.string()
		.required()
		.valid(...Object.values(STATUS))
		.trim()
		.strict(),
});

export default {
	activateAccountValidationMiddleware: Validation.bodyValidationMiddleware(
		activateAccountSchema,
	),
};

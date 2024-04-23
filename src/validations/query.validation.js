import Validation from "../middlewares/validation.js";
import Joi from "joi";
import joiObjectId from "joi-objectid";

Joi.objectId = joiObjectId(Joi);

const resetPasswordSchema = Joi.object({
	id: Joi.objectId().required(),
	token: Joi.string().required(),
});

export default {
	resetPasswordValidationMiddleware:
		Validation.queryValidationMiddleware(resetPasswordSchema),
};

import Validation from "../middlewares/validation.js";
import Joi from "joi";
import joiObjectId from "joi-objectid";

Joi.objectId = joiObjectId(Joi);

const idSchema = Joi.object({
	id: Joi.objectId(),
});

export default {
	idValidationMiddleware: Validation.paramValidationMiddleware(idSchema),
};

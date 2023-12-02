import CustomError from "../errors/index.js";

const validationMiddleware = (schema) => (req, res, next) => {
	const { error, value } = schema.validate(req.body, {
		abortEarly: false,
		errors: { label: "key", wrap: { label: false } },
	});

	if (!error) {
		next();
	} else {
		const fields = error.details.reduce((obj, item) => {
			obj[item.context.key] = item.message;
			return obj;
		}, {});
		throw new CustomError.BadRequestError("ValidationError", fields);
	}
};

export default validationMiddleware;

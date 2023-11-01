const CustomError = require("../errors");

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

module.exports = validationMiddleware;

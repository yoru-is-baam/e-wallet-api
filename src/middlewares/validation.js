import { BadRequestError } from "../common/responses/fail.response.js";

export default class Validation {
	static #validationMiddleware = (schema, source) => (req, res, next) => {
		const { error, value } = schema.validate(req[source], {
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
			throw new BadRequestError({ data: fields });
		}
	};

	static bodyValidationMiddleware = (schema) =>
		Validation.#validationMiddleware(schema, "body");

	static paramValidationMiddleware = (schema) =>
		Validation.#validationMiddleware(schema, "params");

	static queryValidationMiddleware = (schema) =>
		Validation.#validationMiddleware(schema, "query");
}

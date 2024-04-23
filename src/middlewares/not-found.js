"use strict";

import { NotFoundError } from "../common/responses/fail.response.js";

const notFoundMiddleware = (req, res, next) => {
	const error = new NotFoundError({
		data: null,
		message: "Route does not exist",
	});
	next(error);
};

export default notFoundMiddleware;

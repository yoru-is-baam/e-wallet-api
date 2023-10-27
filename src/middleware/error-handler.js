const { StatusCodes } = require("http-status-codes");

const errorHandlerMiddleware = (err, req, res, next) => {
	console.error(err);

	let customError = {
		// set default
		statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
		message: err.message || "Something went wrong try again later",
		statusText: err.statusCode ? "fail" : "error",
	};

	if (err.name === "ValidationError") {
		customError.message = Object.values(err.errors)
			.map((item) => item.message)
			.join(",");
		customError.statusCode = StatusCodes.BAD_REQUEST;
		customError.statusText = "fail";
	}

	if (err.name === "CastError") {
		customError.message = `Can not find with id : ${err.value}`;
		customError.statusCode = StatusCodes.NOT_FOUND;
		customError.statusText = "fail";
	}

	return res
		.status(customError.statusCode)
		.json({ status: customError.statusText, message: customError.message });
};

module.exports = errorHandlerMiddleware;

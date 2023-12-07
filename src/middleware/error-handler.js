import { StatusCodes } from "http-status-codes";

const errorHandlerMiddleware = (err, req, res, next) => {
	let { name, fields, message, statusCode, value } = err;

	if (name === "CastError") {
		message = `Can not find with id: ${value}`;
		statusCode = StatusCodes.NOT_FOUND;
	}

	if (statusCode) {
		return res.status(statusCode).json({
			status: "fail",
			data: {
				name,
				fields,
				message
			}
		});
	}

	return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
		status: "error",
		message: "Something went wrong try again later"
	});
};

export default errorHandlerMiddleware;

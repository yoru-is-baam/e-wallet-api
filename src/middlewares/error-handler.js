"use strict";

import { StatusCodes } from "http-status-codes";
import logger from "../loggers/winston.log.js";
import { MulterError } from "multer";

const errorHandlerMiddleware = (err, req, res, next) => {
	let { name, value, message, statusCode, data, stack, field } = err;

	// log to file
	logger.error({
		context: req.path,
		requestId: req.requestId,
		metadata: data,
		message,
		stack,
	});

	if (err instanceof MulterError) {
		statusCode = StatusCodes.BAD_REQUEST;
		data = {
			[field]: message,
		};
		message = null;
	}

	// user error
	if (statusCode) {
		return res.status(statusCode).json({
			status: "fail",
			data,
			message,
		});
	}

	// server error
	return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
		status: "error",
		message: "Something went wrong try again later",
	});
};

export default errorHandlerMiddleware;

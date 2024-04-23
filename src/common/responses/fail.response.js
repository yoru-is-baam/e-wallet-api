"use strict";

import { StatusCodes } from "http-status-codes";

class FailResponse extends Error {
	constructor({ data = null, message = null }) {
		super(message);
		this.data = data;
		this.message = message;
	}
}

class BadRequestError extends FailResponse {
	constructor({ data, message }) {
		super({ data, message });
		this.statusCode = StatusCodes.BAD_REQUEST;
	}
}

class UnauthorizedError extends FailResponse {
	constructor({ data, message }) {
		super({ data, message });
		this.statusCode = StatusCodes.FORBIDDEN;
	}
}

class NotFoundError extends FailResponse {
	constructor({ data, message }) {
		super({ data, message });
		this.statusCode = StatusCodes.NOT_FOUND;
	}
}

class UnauthenticatedError extends FailResponse {
	constructor({ data, message }) {
		super({ data, message });
		this.statusCode = StatusCodes.UNAUTHORIZED;
	}
}
export {
	BadRequestError,
	UnauthorizedError,
	NotFoundError,
	UnauthenticatedError,
};

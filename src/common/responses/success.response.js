"use strict";

import { StatusCodes } from "http-status-codes";
import Response from "./response.js";

class SuccessResponse extends Response {
	constructor({ status = "success", statusCode, data }) {
		super({ status, statusCode, data });
	}
}

class OkResponse extends SuccessResponse {
	constructor({ statusCode = StatusCodes.OK, data }) {
		super({ statusCode, data });
	}
}

class CreatedResponse extends SuccessResponse {
	constructor({ statusCode = StatusCodes.CREATED, data }) {
		super({ statusCode, data });
	}
}

class NoContentResponse extends SuccessResponse {
	constructor({ statusCode = StatusCodes.NO_CONTENT, data }) {
		super({ statusCode, data });
	}
}

export { OkResponse, CreatedResponse, NoContentResponse };

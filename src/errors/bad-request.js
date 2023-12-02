import { StatusCodes } from "http-status-codes";
import CustomAPIError from "./custom-api.js";

class BadRequestError extends CustomAPIError {
	constructor(name, fields, message) {
		super(name, fields, message);
		this.statusCode = StatusCodes.BAD_REQUEST;
	}
}

export default BadRequestError;

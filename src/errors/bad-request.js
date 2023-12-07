import { StatusCodes } from "http-status-codes";
import CustomError from "./custom-error.js";

class BadRequestError extends CustomError {
	constructor(name, fields, message) {
		super(name, fields, message);
		this.statusCode = StatusCodes.BAD_REQUEST;
	}
}

export default BadRequestError;

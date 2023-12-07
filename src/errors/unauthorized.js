import { StatusCodes } from "http-status-codes";
import CustomError from "./custom-error.js";

class UnauthorizedError extends CustomError {
	constructor(name, fields, message) {
		super(name, fields, message);
		this.statusCode = StatusCodes.FORBIDDEN;
	}
}

export default UnauthorizedError;

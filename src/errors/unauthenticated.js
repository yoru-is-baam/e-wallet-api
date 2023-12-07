import { StatusCodes } from "http-status-codes";
import CustomError from "./custom-error.js";

class UnauthenticatedError extends CustomError {
	constructor(name, fields, message) {
		super(name, fields, message);
		this.statusCode = StatusCodes.UNAUTHORIZED;
	}
}

export default UnauthenticatedError;

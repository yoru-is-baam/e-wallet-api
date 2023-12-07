import { StatusCodes } from "http-status-codes";
import CustomError from "./custom-error.js";

class NotFoundError extends CustomError {
	constructor(name, fields, message) {
		super(name, fields, message);
		this.statusCode = StatusCodes.NOT_FOUND;
	}
}

export default NotFoundError;

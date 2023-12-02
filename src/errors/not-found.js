import { StatusCodes } from "http-status-codes";
import CustomAPIError from "./custom-api.js";

class NotFoundError extends CustomAPIError {
	constructor(name, fields, message) {
		super(name, fields, message);
		this.statusCode = StatusCodes.NOT_FOUND;
	}
}

export default NotFoundError;

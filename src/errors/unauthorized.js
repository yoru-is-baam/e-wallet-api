import { StatusCodes } from "http-status-codes";
import CustomAPIError from "./custom-api.js";

class UnauthorizedError extends CustomAPIError {
	constructor(name, fields, message) {
		super(name, fields, message);
		this.statusCode = StatusCodes.FORBIDDEN;
	}
}

export default UnauthorizedError;

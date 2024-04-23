"use strict";

export default class Response {
	constructor({ status, statusCode, data = null }) {
		this.status = status;
		this.statusCode = statusCode;
		this.data = data;
	}

	send(res) {
		return res.status(this.statusCode).json({
			status: this.status,
			data: this.data,
		});
	}
}

class CustomAPIError extends Error {
	constructor(name, fields, message = null) {
		super(message);
		this.name = name;
		this.fields = fields;
	}
}

module.exports = CustomAPIError;

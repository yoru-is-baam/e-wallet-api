class CustomError extends Error {
	constructor(name, fields, message = null) {
		super(message);
		this.name = name;
		this.fields = fields;
	}
}

export default CustomError;

export class GeneratorService {
	static generateNumericalString = (length) => {
		return GeneratorService.generateWithPattern("0123456789", length);
	};

	static generateRandomString = (length) => {
		return GeneratorService.generateWithPattern(
			"0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
			length,
		);
	};

	static generatePayload = (user) => {
		return {
			name: user.role === "admin" ? "admin" : user.name,
			userId: user._id,
			status: user.status,
			role: user.role,
		};
	};

	static generateWithPattern = (chars, length) => {
		let randomString = "";

		for (let i = 0; i < length; i++) {
			randomString += chars[Math.floor(Math.random() * chars.length)];
		}

		return randomString;
	};
}

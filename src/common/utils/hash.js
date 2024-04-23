import bcrypt from "bcryptjs";

export class HashService {
	static hashString = async (candidateString) => {
		const salt = await bcrypt.genSalt(10);
		return await bcrypt.hash(candidateString, salt);
	};

	static compareHashedString = async (candidateString, hashedString) => {
		return await bcrypt.compare(candidateString, hashedString);
	};
}

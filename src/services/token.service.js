import { Token } from "../models/index.js";

export default class TokenService {
	static createToken = async (userId, token) => {
		return await Token.create({ userId, token });
	};

	static findToken = async (fields, lean = false) => {
		return await Token.findOne(fields, { lean });
	};

	static findTokenById = async (id, lean = false) => {
		return await Token.findById(id, { lean });
	};
}

import JWT from "jsonwebtoken";
import { AUTH_TOKEN } from "../constants/index.js";

const {
	ACCESS_TOKEN_SECRET,
	ACCESS_TOKEN_LIFETIME,
	REFRESH_TOKEN_SECRET,
	REFRESH_TOKEN_LIFETIME,
} = process.env;

export class JwtService {
	static createTokenPair = (payload) => {
		const accessToken = JWT.sign(payload, ACCESS_TOKEN_SECRET, {
			expiresIn: ACCESS_TOKEN_LIFETIME,
		});

		const refreshToken = JWT.sign(payload, REFRESH_TOKEN_SECRET, {
			expiresIn: REFRESH_TOKEN_LIFETIME,
		});

		return { accessToken, refreshToken };
	};

	static verifyToken = (token, type) => {
		let key;
		if (type === AUTH_TOKEN.ACCESS_TOKEN) {
			key = ACCESS_TOKEN_SECRET;
		} else {
			key = REFRESH_TOKEN_SECRET;
		}

		const decoded = JWT.verify(token, key);
		return decoded;
	};
}

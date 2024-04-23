import { JwtService } from "../common/utils/index.js";
import { HEADER, AUTH_TOKEN } from "../common/constants/index.js";
import { UnauthenticatedError } from "../common/responses/fail.response.js";

export default class Authentication {
	static authenticateToken = async (req, res, next) => {
		let accessToken;
		const authHeader = req.headers[HEADER.AUTHORIZATION];

		if (authHeader && authHeader.startsWith("Bearer ")) {
			accessToken = authHeader.split(" ")[1];
		}

		if (!accessToken)
			throw new UnauthenticatedError({ message: "Unauthenticated user" });

		try {
			const { userId, name, status, role } = JwtService.verifyToken(
				accessToken,
				AUTH_TOKEN.ACCESS_TOKEN,
			);
			req.user = { userId, name, status, role };
			next();
		} catch (error) {
			throw new UnauthenticatedError({ message: "Invalid access token" });
		}
	};
}

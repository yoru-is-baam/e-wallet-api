import { ROLE } from "../common/constants/index.js";
import { UnauthorizedError } from "../common/responses/fail.response.js";

export default class Authorization {
	static authorizePermissions = (...roles) => {
		return (req, res, next) => {
			if (!roles.includes(req.user.role)) {
				throw new UnauthorizedError({
					message: "Unauthorized to access this route",
				});
			}
			next();
		};
	};

	static checkPermissions = (req, res, next) => {
		const { userId: requestUserId, role: requestUserRole } = req.user;
		const resourceUserId = req.params.id;

		if (requestUserRole === ROLE.ADMIN) return next();
		if (requestUserId === resourceUserId) return next();

		throw new UnauthorizedError({
			message: "Unauthorized to access this route",
		});
	};
}

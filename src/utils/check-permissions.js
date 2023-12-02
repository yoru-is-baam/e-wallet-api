import CustomError from "../errors/index.js";

// Just user can view their profile, admin can view all
const checkPermissions = (requestUser, resourceUserId) => {
	if (requestUser.role === "admin") return;
	if (requestUser.userId === resourceUserId.toString()) return;
	throw new CustomError.UnauthorizedError(
		"PermissionError",
		null,
		"Not authorized to access this route"
	);
};

export default checkPermissions;

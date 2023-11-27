const CustomError = require("../errors");

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

module.exports = checkPermissions;

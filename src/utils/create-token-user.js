const createTokenUser = (user) => {
	return {
		name: user.role === "admin" ? "admin" : user.profile.name,
		userId: user._id,
		status: user.status,
		role: user.role,
	};
};

module.exports = createTokenUser;

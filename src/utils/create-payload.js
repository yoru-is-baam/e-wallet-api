const createPayload = (user) => {
	return {
		name: user.role === "admin" ? "admin" : user.profile.name,
		userId: user._id,
		status: user.status,
		role: user.role,
	};
};

export default createPayload;

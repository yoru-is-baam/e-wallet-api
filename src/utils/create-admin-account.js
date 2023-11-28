const createAdminAccount = async () => {
	const { User } = require("../models");

	const user = await User.findOne({ username: "administrator" });

	if (!user) {
		await User.create({
			username: "administrator",
			password: "123456",
			status: "verified",
			role: "admin",
			otp: "000000",
		});
	}
};

module.exports = createAdminAccount;

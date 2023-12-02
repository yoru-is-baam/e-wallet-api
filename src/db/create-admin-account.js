import { User } from "../models/index.js";

const createAdminAccount = async () => {
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

export default createAdminAccount;

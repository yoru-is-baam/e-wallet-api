import "./src/db/init.mongodb.js";
import mongoose from "mongoose";
import { User } from "./src/models/index.js";

const createAdminAccount = async () => {
	const user = await User.findOne({ email: "administrator@gmail.com" });

	if (!user) {
		await User.create({
			email: "administrator@gmail.com",
			password: "123456",
			status: "verified",
			role: "admin",
			otp: null,
		});
	}
};

async function seed() {
	try {
		await createAdminAccount();
		console.log("Seed data inserted successfully!");
	} catch (err) {
		console.error("Error seeding data:", err);
	} finally {
		mongoose.disconnect();
	}
}

seed();

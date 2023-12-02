// database
import connectDB from "./db/connect.js";

// create admin account default
import createAdminAccount from "./db/create-admin-account.js";

import app from "./app.js";

const port = process.env.PORT || 3000;

const startServer = async () => {
	try {
		await connectDB(process.env.MONGO_URI);
		await createAdminAccount();
		app.listen(port, () =>
			console.log(`Server is listening on port ${port}...`)
		);
	} catch (error) {
		console.log(error);
	}
};

startServer();

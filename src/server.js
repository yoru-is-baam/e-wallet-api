// database
const connectDB = require("./db/connect");

// create admin account default
const { createAdminAccount } = require("./utils");

const app = require("./app");

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

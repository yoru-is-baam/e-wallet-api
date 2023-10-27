require("dotenv").config();
require("express-async-errors");

// express
const express = require("express");
const app = express();

// packages
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

// database
const connectDB = require("./db/connect");

// create admin account default
const { createAdminAccount } = require("./utils");

const authRouter = require("./routes/auth.route");
const userRouter = require("./routes/user.route");
const walletRouter = require("./routes/wallet.route");

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

app.use((req, res, next) => {
	req.vars = { root: __dirname }; // __dirname is current folder
	next();
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/wallets", walletRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

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

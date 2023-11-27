require("dotenv").config();
require("express-async-errors");

// express
const express = require("express");
const app = express();

// packages
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const winston = require("winston"),
	expressWinston = require("express-winston");

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use((req, res, next) => {
	req.vars = { root: __dirname }; // __dirname is current folder
	next();
});

app.use("/api", require("./routes"));

// log internal errors
app.use(
	expressWinston.errorLogger({
		transports: [
			new winston.transports.File({
				filename: "./src/logs/errors.log",
			}),
		],
		format: winston.format.combine(
			winston.format.timestamp({
				format: new Date().toLocaleString("en-US", {
					timeZone: "Asia/Ho_Chi_Minh",
				}),
			}),
			winston.format.json(),
			winston.format.prettyPrint()
		),
	})
);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

module.exports = app;

require("dotenv").config();
require("express-async-errors");

// express
const express = require("express");
const app = express();

// packages
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

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

app.use("/api", require("./routes"));

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

module.exports = app;

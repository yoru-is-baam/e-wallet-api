import "dotenv/config";
import "express-async-errors";

// express
import express from "express";
const app = express();

// routes
import route from "./routes/index.js";

// packages
import morgan from "morgan";
import cookieParser from "cookie-parser";
import logger from "./configs/logger.config.js";

// error handler
import notFoundMiddleware from "./middleware/not-found.js";
import errorHandlerMiddleware from "./middleware/error-handler.js";

app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use((req, res, next) => {
	req.vars = { root: __dirname }; // __dirname is current folder
	next();
});

app.use("/api", route);

// log internal errors
app.use(logger);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

export default app;

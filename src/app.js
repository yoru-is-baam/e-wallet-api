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

// extra security packages
import helmet from "helmet";
import cors from "cors";
import rateLimiter from "express-rate-limit";

// error handler
import notFoundMiddleware from "./middleware/not-found.js";
import errorHandlerMiddleware from "./middleware/error-handler.js";

app.set("trust proxy", 1);
app.use(
	rateLimiter({
		windowMs: 15 * 60 * 1000, // 15 minutes
		max: 100 // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	})
);
app.use(helmet());
app.use(cors());

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

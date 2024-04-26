import "dotenv/config";
import "express-async-errors";

import express from "express";

import { v4 as uuidv4 } from "uuid";
import { rateLimit } from "express-rate-limit";
import { HEADER } from "./common/constants/index.js";
import rateLimitOptions from "./configs/limiter.config.js";

import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import cookieParser from "cookie-parser";
import mongoSanitize from "express-mongo-sanitize";

// Swagger
import YAML from "yamljs";
import swaggerUI from "swagger-ui-express";

import routeV1 from "./routes/v1/index.js";
import logger from "./loggers/winston.log.js";
import notFoundMiddleware from "./middlewares/not-found.js";
import errorHandlerMiddleware from "./middlewares/error-handler.js";

const app = express();
const swaggerDocument = YAML.load("./swagger.yml");

app.use(express.json());
app.use(
	express.urlencoded({
		extended: true,
	}),
);
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(mongoSanitize());
app.use(morgan("dev"));
app.use(rateLimit(rateLimitOptions));
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use((req, res, next) => {
	const requestId = req.headers[HEADER.REQUEST_ID];
	req.requestId = requestId ?? uuidv4();

	logger.info({
		context: req.path,
		requestId: req.requestId,
		metadata: req.method == "POST" ? req.body : req.query,
		message: `Sent ${req.method} method`,
	});

	next();
});

import "./db/init.mongodb.js";
// import { checkOverload } from "./helpers/check.connect.js";
// checkOverload();

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));
app.use("/api/v1", routeV1);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

export default app;

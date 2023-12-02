import winston from "winston";
import expressWinston from "express-winston";

export default expressWinston.errorLogger({
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
});

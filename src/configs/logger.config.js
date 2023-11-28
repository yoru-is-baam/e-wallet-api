const winston = require("winston"),
	expressWinston = require("express-winston");

module.exports = expressWinston.errorLogger({
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

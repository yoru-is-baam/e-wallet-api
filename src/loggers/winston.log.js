"use strict";

import { createLogger, format, transports } from "winston";
import "winston-daily-rotate-file";

class Logger {
	constructor() {
		const printFormat = format.printf((info) => {
			let logMessage = `\n[${info.timestamp}] ${info.level}: ${info.context} - ${info.requestId}`;

			if (info.message) {
				logMessage += `\n${info.message}`;
			}

			if (info.stack) {
				logMessage += `\n${info.stack}`;
			}

			if (info.metadata) {
				logMessage += `\n${JSON.stringify(info.metadata)}`;
			}

			return logMessage;
		});

		this.logger = createLogger({
			format: format.combine(
				format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
				printFormat,
			),
			transports: [
				// new transports.Console(),
				new transports.DailyRotateFile({
					dirname: "src/logs/info",
					filename: "application-%DATE%.info.log",
					datePattern: "YYYY-MM-DD-HH",
					zippedArchive: true,
					maxSize: "20m",
					maxFiles: "14d",
					format: format.combine(
						format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
						printFormat,
					),
					level: "info",
				}),
				new transports.DailyRotateFile({
					dirname: "src/logs/error",
					filename: "application-%DATE%.error.log",
					datePattern: "YYYY-MM-DD-HH",
					zippedArchive: true,
					maxSize: "20m",
					maxFiles: "14d",
					format: format.combine(
						format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
						printFormat,
					),
					level: "error",
				}),
			],
		});
	}

	info(message) {
		this.logger.info(message);
	}

	error(message) {
		this.logger.error(message);
	}
}

export default new Logger();

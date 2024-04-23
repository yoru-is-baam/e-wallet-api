import nodemailer from "nodemailer";
import transport from "../configs/mail.config.js";
import logger from "../loggers/winston.log.js";

class MailService {
	constructor() {
		this.transporter = nodemailer.createTransport(transport);
	}

	sendMail = async (to, subject, html) => {
		const from = `Administrator 👻 <${transport.auth.user}>`;

		try {
			await this.transporter.sendMail({ from, to, subject, html });
		} catch (error) {
			logger.error({ message: error.message, stack: error.stack });
			console.error(error);
		}
	};
}

export default new MailService();

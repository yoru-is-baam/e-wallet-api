const nodemailer = require("nodemailer");
const { EMAIL_ADMIN, PASS_ADMIN } = process.env;

const transport = {
	host: "smtp.gmail.com",
	port: 465,
	secure: true,
	auth: {
		user: EMAIL_ADMIN,
		pass: PASS_ADMIN,
	},
};

class MailService {
	constructor() {
		this.transporter = nodemailer.createTransport(transport);
	}

	static getInstance() {
		if (this.instance) {
			return this.instance;
		}

		this.instance = new MailService();
		return this.instance;
	}

	sendEmail(from, to, subject, html) {
		return this.transporter.sendMail({ from, to, subject, html });
	}
}

module.exports = MailService;

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
const transporter = nodemailer.createTransport(transport);

/**
 * Send an email
 * @param {string} to
 * @param {string} subject
 * @param {string} html
 * @returns {Promise}
 */
const sendEmail = async (to, subject, html) => {
	const from = `Administrator 👻 <${EMAIL_ADMIN}>`;

	await transporter.sendMail({ from, to, subject, html });
};

module.exports = { sendEmail };

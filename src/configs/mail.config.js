const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

export default {
	host: SMTP_HOST,
	port: SMTP_PORT,
	secure: true,
	auth: {
		user: SMTP_USER,
		pass: SMTP_PASS,
	},
};

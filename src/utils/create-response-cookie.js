const attachCookiesToResponse = ({ res, cookie }) => {
	res.cookie(cookie.key, cookie.value, {
		httpOnly: true,
		expires: new Date(Date.now() + cookie.time),
		secure: process.env.NODE_ENV === "production",
		signed: true,
	});
};

module.exports = attachCookiesToResponse;

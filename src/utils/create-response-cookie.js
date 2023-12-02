const attachCookiesToResponse = ({ res, cookie }) => {
	const options = {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		signed: true,
		sameSite: "strict",
	};

	if (cookie.lifetime) {
		options.maxAge = cookie.lifetime;
	}

	res.cookie(cookie.key, cookie.value, options);
};

export default attachCookiesToResponse;

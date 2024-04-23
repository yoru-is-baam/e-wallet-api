const cookieOptions = {
	httpOnly: true,
	secure: process.env.NODE_ENV === "production",
	signed: true,
	sameSite: "strict",
};

export default cookieOptions;

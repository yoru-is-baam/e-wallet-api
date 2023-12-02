import jwt from "jsonwebtoken";

const createAccessToken = (payload) => {
	const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: process.env.ACCESS_TOKEN_LIFETIME,
	});

	return accessToken;
};

const createRefreshToken = (payload) => {
	const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
		expiresIn: process.env.REFRESH_TOKEN_LIFETIME,
	});

	return refreshToken;
};

const createTokenStrategies = {
	accessToken: createAccessToken,
	refreshToken: createRefreshToken,
};

const createJWT = (payload, tokenType) =>
	createTokenStrategies[tokenType](payload);

// verify
const verifyAccessToken = (token) =>
	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

const verifyRefreshToken = (token) =>
	jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

const verifyTokenStrategies = {
	accessToken: verifyAccessToken,
	refreshToken: verifyRefreshToken,
};

const verifyToken = (token) => {
	const [key, value] = Object.entries(token)[0];
	return verifyTokenStrategies[key](value);
};

export { createJWT, verifyToken };

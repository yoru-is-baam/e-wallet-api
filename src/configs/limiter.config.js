const rateLimitOptions = {
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 15, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
};

export default rateLimitOptions;

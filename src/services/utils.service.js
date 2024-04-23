export default class UtilsService {
	static paginate = (query, page, limit) => {
		const skip = (page - 1) * limit;
		return query.skip(skip).limit(limit);
	};

	static sort = (query, options) => {
		if (options) {
			const sortArgs = options.split(",").join(" ");
			query = query.sort(sortArgs);
		} else {
			query = query.sort("createdAt");
		}

		return query;
	};
}

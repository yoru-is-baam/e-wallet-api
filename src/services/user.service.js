import { ROLE } from "../common/constants/index.js";
import { BadRequestError } from "../common/responses/fail.response.js";
import { User } from "../models/index.js";
import UtilsService from "./utils.service.js";

export default class UserService {
	static createUser = async (createUserDto) => {
		return await User.create(createUserDto);
	};

	static updateUser = async (userId, updateUserDto) => {
		return await User.findByIdAndUpdate(userId, updateUserDto).lean();
	};

	static findUser = async (fields, lean = false) => {
		return await User.findOne(fields, { lean });
	};

	static findUserById = async (userId, lean = false) => {
		return await User.findById(userId, { lean });
	};

	static getUsers = async (filters) => {
		const { status, sort, wrongCount, page = 1, limit = 10 } = filters;

		// just get user role
		const fields = { role: ROLE.USER };

		if (status) fields.status = status;
		if (wrongCount) fields.wrongCount = wrongCount;

		let query = User.find(fields)
			.select("-password -role -__v -refreshToken")
			.lean();

		// sort options or default
		query = UtilsService.sort(query, sort);

		// pagination
		query = UtilsService.paginate(query, page, limit);

		const users = await query;

		return { total: users.length, page, size: limit, users };
	};

	static getProfile = async (userId) => {
		const user = await User.findById(userId)
			.select("email status phone name birth address idImages")
			.lean();

		if (!user)
			throw new BadRequestError({
				data: { userId: `No user found with ${userId}` },
			});

		return { user };
	};
}

import { UserService } from "../services/index.js";

import { OkResponse } from "../common/responses/success.response.js";

export default class UserController {
	static getUsers = async (req, res, next) => {
		new OkResponse({
			data: await UserService.getUsers(req.query),
		}).send(res);
	};

	static getUser = async (req, res, next) => {
		new OkResponse({
			data: await UserService.getProfile(req.params.id),
		}).send(res);
	};
}

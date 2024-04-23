import {
	OkResponse,
	NoContentResponse,
} from "../common/responses/success.response.js";
import { AccountService } from "../services/index.js";

export default class AccountController {
	static unblockAccount = async (req, res, next) => {
		new NoContentResponse({
			data: await AccountService.unblockAccount(req.params.id),
		}).send(res);
	};

	static activateAccount = async (req, res, next) => {
		new NoContentResponse({
			data: await AccountService.activateAccount(
				req.params.id,
				req.body.status,
			),
		}).send(res);
	};
}

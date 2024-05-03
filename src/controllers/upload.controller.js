import { OkResponse } from "../common/responses/success.response.js";
import { UploadService } from "../services/index.js";

export default class UploadController {
	static uploadID = async (req, res, next) => {
		new OkResponse({
			data: await UploadService.uploadID(req.user.userId, req.files),
		}).send(res);
	};
}

import { OkResponse } from "../common/responses/success.response.js";
import { UploadService } from "../services/index.js";

export default class UploadController {
	static uploadID = async (req, res, next) => {
		// NEED-TO-BE-FIXED: DO NOT UPLOAD TO CLOUDINARY WHEN ONE OF TWO FILES IS EMPTY
		new OkResponse({
			data: await UploadService.uploadID(req.user.userId, req.files),
		}).send(res);
	};
}

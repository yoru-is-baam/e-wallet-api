import cloudinary from "../configs/cloudinary.config.js";
import { BadRequestError } from "../common/responses/fail.response.js";
import UserService from "./user.service.js";

export default class UploadService {
	static uploadID = async (userId, { idFront, idBack }) => {
		if (!idFront || !idBack) {
			Promise.all([
				idFront?.[0] && cloudinary.uploader.destroy(idFront[0].filename),
				idBack?.[0] && cloudinary.uploader.destroy(idBack[0].filename),
			]);

			throw new BadRequestError({
				data: {
					idFront: "ID can not be empty",
					idBack: "ID can not be empty",
				},
			});
		}

		const idImages = {
			front: idFront[0].filename,
			back: idBack[0].filename,
		};

		const user = await UserService.updateUser(userId, { idImages });
		if (!user)
			throw new BadRequestError({
				data: { userId: `No user found with ${userId}` },
			});

		return { userId };
	};

	static removeID = async ({ front, back }) => {
		await cloudinary.uploader.destroy(front);
		await cloudinary.uploader.destroy(back);
	};
}

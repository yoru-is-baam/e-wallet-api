import cloudinary from "../configs/cloudinary.config.js";
import { BadRequestError } from "../common/responses/fail.response.js";
import UserService from "./user.service.js";

import fs from "fs";

export default class UploadService {
	static uploadID = async (userId, { idFront, idBack }) => {
		// validate
		if (!idFront || !idBack) {
			// remove tmp file
			if (idFront?.[0]) fs.promises.unlink(idFront[0].path);
			if (idBack?.[0]) fs.promises.unlink(idBack[0].path);

			throw new BadRequestError({
				data: {
					idFront: "ID can not be empty",
					idBack: "ID can not be empty",
				},
			});
		}

		// cloudinary
		const options = {
			folder: `e-wallet/${userId}`,
			format: "jpg",
		};

		// update path in db
		const idImages = {
			front: `${options.folder}/${idFront[0].filename}`,
			back: `${options.folder}/${idBack[0].filename}`,
		};

		const user = await UserService.updateUser(userId, { idImages });
		if (!user)
			throw new BadRequestError({
				data: { userId: `No user found with ${userId}` },
			});

		// upload to cloudinary
		cloudinary.uploader.upload(idFront[0].path, options);
		cloudinary.uploader.upload(idBack[0].path, options);

		// delete tmp file
		fs.promises.unlink(idFront[0].path);
		fs.promises.unlink(idBack[0].path);

		return { userId };
	};

	static removeID = async ({ front, back }) => {
		await cloudinary.uploader.destroy(front);
		await cloudinary.uploader.destroy(back);
	};
}

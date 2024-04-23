import UserService from "./user.service.js";
import UploadService from "./upload.service.js";

import { BadRequestError } from "../common/responses/fail.response.js";
import { STATUS } from "../common/constants/index.js";

export default class AccountService {
	static unblockAccount = async (userId) => {
		const user = await UserService.findUserById(userId);
		if (!user)
			throw new BadRequestError({
				data: { userId: `No user found with ${userId}` },
			});

		await user.restoreLoginStatus();

		return { userId };
	};

	static activateAccount = async (userId, status) => {
		const user = await UserService.findUserById(userId);
		if (!user)
			throw new BadRequestError({
				data: { userId: `No user found with ${userId}` },
			});

		let updateUserDto = { status };
		if (status === STATUS.UPDATING) {
			updateUserDto.idImages = { front: null, back: null };
			// remove ID in cloudinary
			await UploadService.removeID(user.idImages);
		}

		await user.updateOne(updateUserDto);

		return { userId };
	};
}

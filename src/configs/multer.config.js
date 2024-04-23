import path from "path";
import multer from "multer";

import cloudinary from "./cloudinary.config.js";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { BadRequestError } from "../common/responses/fail.response.js";

const cloudinaryStorage = new CloudinaryStorage({
	cloudinary,
	params: {
		folder: (req, res) => `e-wallet/${req.user.userId}`,
		format: "jpg",
	},
});

const fileFilter = (req, file, callback) => {
	let filetypes = /jpeg|jpg|png|gif|jfif/;
	let mimetype = filetypes.test(file.mimetype);
	let extname = filetypes.test(path.extname(file.originalname).toLowerCase());

	if (mimetype && extname) {
		callback(null, true);
	} else {
		callback(
			new BadRequestError({
				data: { [file.fieldname]: "Only image files are allowed" },
			}),
			false,
		);
	}
};

const multerUploader = multer({
	storage: cloudinaryStorage,
	fileFilter,
	limits: {
		fileSize: 1024 * 1024, // 1MB
	},
});

export default multerUploader;

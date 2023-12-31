import CustomError from "../errors/index.js";

import path from "path";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.config.js";

const storage = new CloudinaryStorage({
	cloudinary,
	params: {
		folder: (req, res) => `uploads/${req.params.id}`,
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
			new CustomError.BadRequestError("Only image files are allowed"),
			false
		);
	}
};

const multerUploader = multer({
	storage,
	fileFilter,
	limits: {
		fileSize: 1024 * 1024, // 1MB
	},
	onError: (err, req, res, next) => {
		if (err.code === "413") {
			throw new CustomError.BadRequestError("File is too large");
		}
	},
});

export { multerUploader };

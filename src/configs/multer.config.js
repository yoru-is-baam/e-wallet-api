import path from "path";
import multer from "multer";

import { BadRequestError } from "../common/responses/fail.response.js";

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
	dest: "./src/uploads",
	fileFilter,
	limits: {
		fileSize: 1024 * 1024, // 1MB
	},
});

export default multerUploader;

import express from "express";
const router = express.Router();

import UserController from "../../controllers/user.controller.js";
import UploadController from "../../controllers/upload.controller.js";

// import UserValidation from "../../validations/user.validation.js";
import ParamValidation from "../../validations/param.validation.js";

import multerUploader from "../../configs/multer.config.js";

import Authentication from "../../middlewares/authentication.js";
import Authorization from "../../middlewares/authorization.js";
import { ROLE } from "../../common/constants/index.js";

router.use(Authentication.authenticateToken);

router
	.route("/")
	.get(
		[Authorization.authorizePermissions(ROLE.ADMIN)],
		UserController.getUsers,
	);

router.get(
	"/:id",
	[ParamValidation.idValidationMiddleware, Authorization.checkPermissions],
	UserController.getUser,
);

router.post(
	"/upload",
	[
		multerUploader.fields([
			{ name: "idFront", maxCount: 1 },
			{ name: "idBack", maxCount: 1 },
		]),
	],
	UploadController.uploadID,
);

// router.delete(
// 	"/remove-id",
// 	[authorizePermissions("admin")],
// 	UserController.removeID,
// );

export default router;

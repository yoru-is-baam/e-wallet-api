import { Router } from "express";
const router = Router();

import ParamValidation from "../../validations/param.validation.js";
import AccountValidation from "../../validations/account.validation.js";

import AccountController from "../../controllers/account.controller.js";

import Authentication from "../../middlewares/authentication.js";
import Authorization from "../../middlewares/authorization.js";
import { ROLE } from "../../common/constants/index.js";

router.use(Authentication.authenticateToken);

router.patch(
	"/:id/unblock",
	[
		Authorization.authorizePermissions(ROLE.ADMIN),
		ParamValidation.idValidationMiddleware,
	],
	AccountController.unblockAccount,
);

router.patch(
	"/:id/activate",
	[
		Authorization.authorizePermissions(ROLE.ADMIN),
		ParamValidation.idValidationMiddleware,
		AccountValidation.activateAccountValidationMiddleware,
	],
	AccountController.activateAccount,
);

export default router;

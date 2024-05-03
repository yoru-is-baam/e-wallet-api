import { AuthService } from "../services/index.js";
import {
	CreatedResponse,
	OkResponse,
	NoContentResponse,
} from "../common/responses/success.response.js";
import cookieOptions from "../configs/cookie.config.js";

export default class AuthController {
	static register = async (req, res, next) => {
		new CreatedResponse({
			data: await AuthService.register(req.body),
		}).send(res);
	};

	static loginWithEmailAndPassword = async (req, res, next) => {
		const { accessToken, refreshToken } =
			await AuthService.loginWithEmailAndPassword(req.body);

		const THIRTY_DAYS_IN_MILLISECONDS = 30 * 24 * 60 * 60 * 1000;
		res.cookie("refreshToken", refreshToken, {
			...cookieOptions,
			maxAge: THIRTY_DAYS_IN_MILLISECONDS,
		});

		new OkResponse({
			data: { accessToken },
		}).send(res);
	};

	static logout = async (req, res, next) => {
		res.clearCookie("refreshToken");

		await AuthService.logout(req.user.userId);

		new NoContentResponse({}).send(res);
	};

	static refreshToken = async (req, res, next) => {
		const { accessToken, refreshToken } = await AuthService.refreshToken(
			req.signedCookies?.refreshToken,
		);

		const THIRTY_DAYS_IN_MILLISECONDS = 30 * 24 * 60 * 60 * 1000;
		res.cookie("refreshToken", refreshToken, {
			...cookieOptions,
			maxAge: THIRTY_DAYS_IN_MILLISECONDS,
		});

		new CreatedResponse({
			data: { accessToken },
		}).send(res);
	};

	static changePassword = async (req, res, next) => {
		new OkResponse({
			data: await AuthService.changePassword(req.user.userId, req.body),
		}).send(res);
	};

	static forgotPassword = async (req, res, next) => {
		new OkResponse({
			data: await AuthService.forgotPassword(req.body),
		}).send(res);
	};

	static resetPassword = async (req, res, next) => {
		new OkResponse({
			data: await AuthService.resetPassword(req.body),
		}).send(res);
	};
}

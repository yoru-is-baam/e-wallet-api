import { AuthService, MailService } from "../services/index.js";
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
		const { userId, resetToken, name } = await AuthService.forgotPassword(
			req.body,
		);

		const passwordResetLink = `${process.env.CLIENT_URL}?token=${resetToken}&id=${userId}`;

		// SEND MAIL
		MailService.sendMail(
			req.body.email,
			"Your password reset link ✔",
			`<html>
			<head>
					<meta charset="UTF-8">
					<meta name="viewport" content="width=device-width, initial-scale=1.0">
					<title>Password Reset Email</title>
					<style>
							body { font-family: Arial, sans-serif; background-color: #f5f5f5; }
							.container { max-width: 600px; margin: 20px auto; padding: 20px; background-color: #ffffff; border: 1px solid #ccc; border-radius: 5px; }
							.header { background-color: #f0f0f0; padding: 20px; text-align: center; border-bottom: 1px solid #ccc; }
							.content { padding: 20px; color: #555555; }
							.footer { padding: 20px; text-align: center; border-top: 1px solid #ccc; }
							.button { display: inline-block; padding: 10px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px; transition: background-color 0.3s; }
							.button:hover { background-color: #0056b3; }
					</style>
			</head>
			<body>
					<div class="container">
							<div class="header"><h2>Password Reset Link</h2></div>
							<div class="content">
									<p>Dear ${name},</p>
									<p>A password reset request has been made for your account. Click the button below to reset your password:</p>
									<p><a class="button" href="${passwordResetLink}" target="_blank">Reset Password</a></p>
									<p>If you didn't request a password reset, please ignore this email.</p>
							</div>
							<div class="footer"><p>This email was sent automatically. Please do not reply.</p></div>
					</div>
			</body>
			</html>`,
		);

		new OkResponse({
			data: { userId },
		}).send(res);
	};

	static resetPassword = async (req, res, next) => {
		new OkResponse({
			data: await AuthService.resetPassword(req.body),
		}).send(res);
	};
}

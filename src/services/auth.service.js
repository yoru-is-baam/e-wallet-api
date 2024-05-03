import UserService from "./user.service.js";
import TokenService from "./token.service.js";
import MailService from "./mail.service.js";

import {
	GeneratorService,
	JwtService,
	HashService,
} from "../common/utils/index.js";
import {
	BadRequestError,
	UnauthenticatedError,
	UnauthorizedError,
} from "../common/responses/fail.response.js";
import { AUTH_TOKEN, ROLE } from "../common/constants/index.js";

import crypto from "node:crypto";

export default class AuthService {
	static register = async (registerDto) => {
		const isEmailTaken = await UserService.findUser(
			{
				email: registerDto.email,
			},
			true,
		);
		if (isEmailTaken)
			throw new BadRequestError({ data: { email: "Email already exists" } });

		const isPhoneTaken = await UserService.findUser(
			{
				phone: registerDto.phone,
			},
			true,
		);
		if (isPhoneTaken)
			throw new BadRequestError({
				data: { phone: "Phone number already exists" },
			});

		const password = GeneratorService.generateRandomString(6);
		const hashedPassword = await HashService.hashString(password);
		console.log(password);

		const user = await UserService.createUser({
			...registerDto,
			password: hashedPassword,
		});

		// SEND MAIL
		MailService.sendMail(
			registerDto.email,
			"Your password ✔",
			`<html>
				<body>
						<div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ccc; border-radius: 5px;">
								<div style="background-color: #f0f0f0; padding: 10px; text-align: center;">
										<h2>Your Password</h2>
								</div>
								<div style="padding: 20px;">
										<p>Dear ${user.name},</p>
										<p>Your password is: <strong>${password}</strong></p>
										<p>Please keep this password secure and do not share it with anyone.</p>
								</div>
								<div style="text-align: center; margin-top: 20px;">
										<p>If you did not request this password, please ignore this email.</p>
								</div>
						</div>
				</body>
			</html>`,
		);

		return { id: user._id };
	};

	static loginWithEmailAndPassword = async ({ email, password }) => {
		// check email
		const user = await UserService.findUser({ email });
		if (!user)
			throw new BadRequestError({
				data: { email: `No user found with ${email}` },
			});

		// admin will not be checked this
		if (user.role === ROLE.USER) {
			const FIRST_WRONG_LIMIT = 3;
			const SECOND_WRONG_LIMIT = 6;
			const ONE_MINUTE_IN_MILLISECONDS = 60000;
			const currentTime = Date.now();
			const blockedTime = currentTime - user.blockedTime;

			if (
				user.wrongCount >= FIRST_WRONG_LIMIT &&
				blockedTime < ONE_MINUTE_IN_MILLISECONDS
			) {
				throw new UnauthorizedError({
					message: "Your account is blocked, please try again after 1 minute",
				});
			} else if (user.wrongCount >= SECOND_WRONG_LIMIT) {
				throw new UnauthorizedError({
					message:
						"Your account is blocked because wrong many times, please contact administrator",
				});
			}
		}

		// check password
		const isPasswordCorrect = await HashService.compareHashedString(
			password,
			user.password,
		);
		if (!isPasswordCorrect) {
			// admin will not be increased wrong count
			if (user.role === ROLE.USER) {
				await user.updateWrongCount();
			}

			throw new UnauthenticatedError({
				data: { password: "Invalid password" },
			});
		} else if (user.wrongCount > 0) {
			// If correct, then check wrong count and restore
			await user.restoreLoginStatus();
		}

		// generate tokens
		const payload = GeneratorService.generatePayload(user);
		const { accessToken, refreshToken } = JwtService.createTokenPair(payload);

		await UserService.updateUser(user._id, { refreshToken });

		return { accessToken, refreshToken };
	};

	static logout = async (userId) => {
		await UserService.updateUser(userId, { refreshToken: null });
		return { userId };
	};

	static refreshToken = async (oldRefreshToken) => {
		if (!oldRefreshToken)
			throw new BadRequestError({ message: "No refresh token found" });

		const user = await UserService.findUser(
			{ refreshToken: oldRefreshToken },
			true,
		);
		if (!user) throw new BadRequestError({ message: "Invalid refresh token" });

		try {
			const { userId, name, status, role } = JwtService.verifyToken(
				oldRefreshToken,
				AUTH_TOKEN.REFRESH_TOKEN,
			);

			const payload = { userId, name, status, role };
			const { accessToken, refreshToken } = JwtService.createTokenPair(payload);

			await UserService.updateUser(user._id, { refreshToken });

			return { accessToken, refreshToken };
		} catch (error) {
			await UserService.updateUser(user._id, { refreshToken: null });

			throw new BadRequestError({ message: "Invalid refresh token" });
		}
	};

	static changePassword = async (userId, { oldPassword, newPassword }) => {
		const user = await UserService.findUserById(userId);

		// check password
		const isPasswordCorrect = await HashService.compareHashedString(
			oldPassword,
			user.password,
		);
		if (!isPasswordCorrect) {
			throw new BadRequestError({
				data: {
					oldPassword: "Invalid old password",
				},
			});
		}

		// hash password
		const password = await HashService.hashString(newPassword);

		// update password
		await user.updateOne({ password });

		return { userId };
	};

	static forgotPassword = async ({ email, phone }) => {
		// check user existence
		const user = await UserService.findUser({ email, phone }, true);
		if (!user)
			throw new BadRequestError({
				data: { email: `Invalid credentials`, phone: `Invalid credentials` },
			});

		// renew token
		let foundToken = await TokenService.findToken({ userId: user._id }, true);
		if (foundToken) await foundToken.deleteOne();

		const resetToken = crypto.randomBytes(32).toString("hex");
		const hashedToken = await HashService.hashString(resetToken);

		await TokenService.createToken(user._id, hashedToken);

		const passwordResetLink = `${process.env.CLIENT_URL}?token=${resetToken}&id=${user._id}`;

		// SEND MAIL
		MailService.sendMail(
			email,
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
									<p>Dear ${user.name},</p>
									<p>A password reset request has been made for your account. Click the button below to reset your password:</p>
									<p><a class="button" href="${passwordResetLink}" target="_blank">Reset Password</a></p>
									<p>If you didn't request a password reset, please ignore this email.</p>
							</div>
							<div class="footer"><p>This email was sent automatically. Please do not reply.</p></div>
					</div>
			</body>
			</html>`,
		);

		return { userId: user._id };
	};

	static resetPassword = async ({ userId, token, newPassword }) => {
		// check token existence
		const foundToken = await TokenService.findToken({ userId });
		if (!foundToken)
			throw new BadRequestError({
				data: { userId: `No token found with ${userId}` },
			});

		// check valid token
		const isTokenCorrect = await HashService.compareHashedString(
			token,
			foundToken.token,
		);
		if (!isTokenCorrect)
			throw new BadRequestError({
				data: { token: `Invalid token` },
			});

		// hash password
		const hashedPassword = await HashService.hashString(newPassword);

		await UserService.updateUser(userId, {
			password: hashedPassword,
		});

		return { userId };
	};
}

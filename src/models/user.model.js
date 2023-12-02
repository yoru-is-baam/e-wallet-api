import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { generateNumericalString } from "../utils/index.js";

const UserSchema = mongoose.Schema(
	{
		username: {
			type: String,
			required: [true, "Please provide username"],
			min: [10, "Please provide a valid username"],
			unique: true,
		},
		password: {
			type: String,
			required: [true, "Please provide password"],
			min: [6, "Please provide a valid password"],
		},
		status: {
			type: String,
			required: true,
			enum: {
				values: ["pending", "verified", "disabled", "updating"],
				message: "Status must be verified, disabled or updating",
			},
			default: "pending",
		},
		wrongCount: {
			type: Number,
			required: true,
			default: 0,
		},
		unusualLogin: {
			type: Boolean,
			required: true,
			default: false,
		},
		blockedTime: {
			type: Date,
			required: true,
			default: 0,
		},
		role: {
			type: String,
			required: true,
			enums: ["admin", "user"],
			default: "user",
		},
		profile: {
			phone: {
				type: String,
				unique: true,
			},
			email: {
				type: String,
				unique: true,
			},
			name: {
				type: String,
			},
			birth: {
				type: String,
			},
			address: {
				type: String,
			},
			idPath: {
				idFront: {
					type: String,
				},
				idBack: {
					type: String,
				},
			},
		},
		otp: {
			type: String,
			required: true,
			default: generateNumericalString(6),
		},
		refreshToken: {
			type: String,
			default: null,
		},
	},
	{ timestamps: true }
);

/**
 * Check if field is taken
 * @param {string} field - Email or phone number or other fields
 * @param {string} value - The user's email or phone number or other values
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
UserSchema.statics.isFieldTaken = async function (field, excludeUserId) {
	let isTaken = null;
	const [key, value] = Object.entries(field)[0];

	if (key !== "email" && key !== "phone") {
		isTaken = await this.exists({
			[key]: value,
			_id: { $ne: excludeUserId },
		});
	} else {
		const fieldProfile = "profile." + [key];
		isTaken = await this.exists({
			[fieldProfile]: value,
			_id: { $ne: excludeUserId },
		});
	}

	return !!isTaken;
};

UserSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return;
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
	next();
});

/**
 * Check if password matches the user's password
 * @param {string} candidatePassword
 * @returns {Promise<boolean>}
 */
UserSchema.methods.comparePassword = async function (candidatePassword) {
	const isMatch = await bcrypt.compare(candidatePassword, this.password);
	return isMatch;
};

UserSchema.methods.updateWrongCount = async function () {
	const FIRST_WRONG_LIMIT = 3;
	++this.wrongCount;

	if (this.wrongCount === FIRST_WRONG_LIMIT) {
		this.unusualLogin = true;
		this.blockedTime = Date.now();
	}

	await this.save();
};

UserSchema.methods.restoreLoginStatus = async function () {
	this.wrongCount = 0;
	this.unusualLogin = false;
	this.blockedTime = 0;

	await this.save();
};

export default mongoose.model("users", UserSchema);

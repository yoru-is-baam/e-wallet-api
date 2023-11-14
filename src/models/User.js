const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { generateNumericalString } = require("../utils");

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

UserSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return;
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
	next();
});

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

module.exports = mongoose.model("users", UserSchema);

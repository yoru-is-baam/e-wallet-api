"use strict";

import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";

const DOCUMENT_NAME = "User";
const COLLECTION_NAME = "users";

const userSchema = new Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: [true, "Please provide password"],
			min: [6, "Please provide a valid password"],
		},
		status: {
			type: String,
			enum: {
				values: ["verified", "disabled", "updating"],
				message: "Status must be verified, disabled or updating",
			},
			default: "updating",
		},
		wrongCount: {
			type: Number,
			default: 0,
		},
		blockedTime: {
			type: Date,
			default: 0,
		},
		role: {
			type: String,
			enums: ["admin", "user"],
			default: "user",
		},
		phone: {
			type: String,
			unique: true,
			default: null,
		},
		name: {
			type: String,
			default: null,
		},
		birth: {
			type: String,
			default: null,
		},
		address: {
			type: String,
			default: null,
		},
		idImages: {
			front: {
				type: String,
				default: null,
			},
			back: {
				type: String,
				default: null,
			},
		},
		refreshToken: {
			type: String,
			default: null,
		},
	},
	{ timestamps: true, collection: COLLECTION_NAME },
);

userSchema.methods.updateWrongCount = async function () {
	const FIRST_WRONG_LIMIT = 3;
	++this.wrongCount;

	if (this.wrongCount === FIRST_WRONG_LIMIT) {
		this.blockedTime = Date.now();
	}

	await this.updateOne({
		wrongCount: this.wrongCount,
		blockedTime: this.blockedTime,
	});
};

userSchema.methods.restoreLoginStatus = async function () {
	this.wrongCount = 0;
	this.blockedTime = 0;

	await this.updateOne({
		wrongCount: this.wrongCount,
		blockedTime: this.blockedTime,
	});
};

export default model(DOCUMENT_NAME, userSchema);

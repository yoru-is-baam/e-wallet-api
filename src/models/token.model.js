"use strict";

import { Schema, model } from "mongoose";

const DOCUMENT_NAME = "Token";
const COLLECTION_NAME = "tokens";

const TWO_MINUTES_IN_SECONDS = 120;

const tokenSchema = new Schema(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
			index: true,
		},
		token: {
			type: String,
			required: true,
		},
		createdAt: {
			type: Date,
			default: Date.now,
			expires: TWO_MINUTES_IN_SECONDS,
		},
	},
	{ collection: COLLECTION_NAME },
);

export default model(DOCUMENT_NAME, tokenSchema);

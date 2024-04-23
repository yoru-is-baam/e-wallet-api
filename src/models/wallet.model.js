"use strict";

import { Schema, model } from "mongoose";

const DOCUMENT_NAME = "Wallet";
const COLLECTION_NAME = "wallets";

const walletSchema = new Schema(
	{
		balance: {
			type: Number,
			default: 0,
		},
		userId: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
			unique: true,
		},
	},
	{ timestamps: true, collection: COLLECTION_NAME },
);

export default model(DOCUMENT_NAME, walletSchema);

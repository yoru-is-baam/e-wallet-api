import mongoose from "mongoose";

const WalletSchema = mongoose.Schema({
	balance: {
		type: Number,
		required: true,
		default: 0,
	},
	userId: {
		type: mongoose.Types.ObjectId,
		ref: "User",
		required: true,
		unique: true,
	},
});

export default mongoose.model("wallets", WalletSchema);

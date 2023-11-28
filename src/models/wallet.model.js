const mongoose = require("mongoose");

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

module.exports = mongoose.model("wallets", WalletSchema);

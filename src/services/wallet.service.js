const { Wallet } = require("../models");

/**
 * Create a wallet
 * @param {string} userId
 * @returns {Promise<Wallet>}
 */
const createWallet = async (userId) => {
	return Wallet.create({ userId });
};

/**
 * Get a wallet by userId
 * @param {string} userId
 * @returns {Promise<Wallet>}
 */
const getWalletByUserId = async (userId) => {
	return Wallet.findOne({ userId });
};

module.exports = {
	createWallet,
	getWalletByUserId,
};

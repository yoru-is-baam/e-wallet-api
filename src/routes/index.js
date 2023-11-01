const express = require("express");
const router = express.Router();

router.use("/v1/auth", require("./auth.route"));
router.use("/v1/users", require("./user.route"));
router.use("/v1/wallets", require("./wallet.route"));

module.exports = router;

import { Router } from "express";
const router = Router();

import AuthRouter from "./auth.route.js";
import UserRouter from "./user.route.js";
import WalletRouter from "./wallet.route.js";
import AccountRouter from "./account.route.js";

router.use("/auth", AuthRouter);
router.use("/users", UserRouter);
router.use("/wallets", WalletRouter);
router.use("/accounts", AccountRouter);

export default router;

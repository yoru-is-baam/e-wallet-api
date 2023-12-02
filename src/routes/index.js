import { Router } from "express";
const router = Router();

import AuthRouter from "./auth.route.js";
import UserRouter from "./user.route.js";
import WalletRouter from "./wallet.route.js";

router.use("/v1/auth", AuthRouter);
router.use("/v1/users", UserRouter);
router.use("/v1/wallets", WalletRouter);

export default router;

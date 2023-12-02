import { Router } from "express";
const router = Router();

router.get("/", (req, res, next) => {
	res.status(200).json({ status: "success", message: "get wallets" });
});

export default router;

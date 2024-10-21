import express from "express";
import authRoute from "./auth/auth";
import schoolRoute from "./school/school";

const router = express.Router();

router.use("/auth", authRoute);
router.use("/school", schoolRoute);

export default router;

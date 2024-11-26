import express from "express";
import authRoute from "./auth/auth";
import schoolRoute from "./school/school";
import studentRoute from "./student/student";

const router = express.Router();

router.use("/auth", authRoute);
router.use("/school", schoolRoute);
router.use("/student", studentRoute);

export default router;

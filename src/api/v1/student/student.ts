import express from "express";
import locationRoute from "./location/location";

const router = express.Router();

router.use("/", locationRoute);

export default router;

import express from "express";
import { APIErrors } from "../../../classes/APIErrors";
import allowAccess from "../../../functions/allowAccess";
import { z } from "zod";
import { WayTrack } from "../../../classes/WayTrack";
import busRoute from "./bus/bus";

const router = express.Router();

router.use("/", busRoute);

router.post("/", allowAccess(["power"]), async (req, res) => {
	try {
		try {
			const schoolData = z
				.object({
					name: z.string(),
					location: z.string(),
				})
				.strict()
				.parse(req.body);

			try {
				const school = new WayTrack.School();
				await school.create(schoolData);

				return res.status(200).json({
					success: true,
					message: "SUCCESS",
					data: {
						school: {
							id: school.id,
							name: school.name,
							location: school.location,
						},
					},
				});
			} catch (e) {
				return res.status(400).json(APIErrors.DB_ERROR(e));
			}
		} catch (e) {
			return res.status(400).json(APIErrors.INVALID_REQUEST_BODY(e));
		}
	} catch (e) {
		return res.status(400).json(APIErrors.UNAUTHORIZED(e));
	}
});

router.get("/", allowAccess(["power"]), async (req, res) => {
	try {
		const school = new WayTrack.School();
		const schoolList = await school.list();

		return res.status(200).json({
			success: true,
			message: "SUCCESS",
			data: {
				schools: schoolList,
			},
		});
	} catch (e) {
		return res.status(400).json(APIErrors.DB_ERROR(e));
	}
});

export default router;

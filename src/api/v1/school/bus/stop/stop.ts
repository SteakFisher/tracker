import express from "express";
import { APIErrors } from "../../../../../classes/APIErrors";
import allowAccess from "../../../../../functions/allowAccess";
import auth from "../../../../../functions/auth";
import { WayTrack } from "../../../../../classes/WayTrack";
import { z } from "zod";

const router = express.Router();

router.post(
	"/:busID/stop",
	allowAccess(["power", "coordinator"]),
	async (req, res) => {
		try {
			let urlSplit = req.originalUrl.split("/");
			let schoolID = urlSplit[urlSplit.length - 4];
			const busID = req.params.busID;
			const payload = await auth(req);

			if (payload.role == "coordinator") {
				const coordinator = new WayTrack.Coordinator();
				await coordinator.getCoordinator(payload.id);

				if (!coordinator.id || !coordinator.schoolID)
					throw new Error("Coordinator not found");

				schoolID = coordinator.schoolID;
			}

			let reqBody = req.body;
			reqBody.busID = busID;
			reqBody.schoolID = schoolID;

			try {
				const stopObject = z
					.object({
						name: z.string(),
						latitude: z.string(),
						longitude: z.string(),
						busID: z.string(),
						schoolID: z.string(),
					})
					.strict()
					.parse(reqBody);

				try {
					const stop = new WayTrack.Stop();
					await stop.create(stopObject);

					if (!stop.id) throw new Error("Stop not created");

					return res.status(200).json({
						success: true,
						message: "SUCCESS",
						data: {
							stop: {
								id: stop.id,
								name: stop.name,
								latitude: stop.latitude,
								longitude: stop.longitude,
								busID: stop.busID,
								schoolID: stop.schoolID,
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
	},
);

export default router;

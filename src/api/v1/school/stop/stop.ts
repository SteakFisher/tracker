import express from "express";
import { APIErrors } from "../../../../classes/APIErrors";
import { WayTrack } from "../../../../classes/WayTrack";
import auth from "../../../../functions/auth";
import allowAccess from "../../../../functions/allowAccess";

const router = express.Router();

router.get(
	"/:schoolID/stop",
	allowAccess(["power", "coordinator"]),
	async (req, res) => {
		try {
			let schoolID = req.params.schoolID;
			const payload = await auth(req);

			if (payload.role === "coordinator") {
				const coordinator = new WayTrack.Coordinator();
				await coordinator.getCoordinator(payload.id);

				if (coordinator.schoolID) {
					schoolID = coordinator.schoolID;
				}
			}
			const stop = new WayTrack.Stop();
			const stops = await stop.getStopsBySchool({ schoolID });

			return res.status(200).json({
				success: true,
				message: "SUCCESS",
				data: {
					stops,
				},
			});
		} catch (e) {
			return res.status(400).json(APIErrors.DB_ERROR(e));
		}
	},
);

export default router;

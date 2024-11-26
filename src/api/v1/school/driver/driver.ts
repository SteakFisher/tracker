import express from "express";
import allowAccess from "../../../../functions/allowAccess";
import auth from "../../../../functions/auth";
import { APIErrors } from "../../../../classes/APIErrors";
import { WayTrack } from "../../../../classes/WayTrack";

const router = express.Router();

router.get(
	"/:schoolID/driver",
	allowAccess(["power", "coordinator"]),
	async (req, res) => {
		let schoolID = req.params.schoolID;

		try {
			const payload = await auth(req);

			try {
				if (payload.role == "coordinator") {
					const coordinator = new WayTrack.Coordinator();
					await coordinator.getCoordinator(payload.id);

					if (!coordinator.id || !coordinator.schoolID)
						throw new Error("Coordinator not found");

					schoolID = coordinator.schoolID;
				}

				const driver = new WayTrack.Driver();
				const driverList = await driver.listDriver({ schoolID });

				return res.status(200).json({
					success: true,
					message: "SUCCESS",
					data: {
						drivers: driverList,
					},
				});
			} catch (e) {
				return res.status(400).json(APIErrors.DB_ERROR(e));
			}
		} catch (e) {
			return res.status(400).json(APIErrors.UNAUTHORIZED(e));
		}
	},
);

export default router;

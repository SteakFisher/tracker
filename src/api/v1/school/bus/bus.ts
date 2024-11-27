import express from "express";
import { z } from "zod";
import auth from "../../../../functions/auth";
import allowAccess from "../../../../functions/allowAccess";
import { WayTrack } from "../../../../classes/WayTrack";
import { APIErrors } from "../../../../classes/APIErrors";
import stopRoute from "./stop/stop";
import locationRoute from "./location/location";

const router = express.Router();

router.use("/:schoolID/bus/", stopRoute);
router.use("/:schoolID/bus/", locationRoute);

router.get(
	"/:schoolID/bus",
	allowAccess(["power", "coordinator"]),
	async (req, res) => {
		try {
			const payload = await auth(req);
			let schoolID = req.params.schoolID;

			if (payload.role == "coordinator") {
				const coordinator = new WayTrack.Coordinator();
				await coordinator.getCoordinator(payload.id);

				if (!coordinator.id || !coordinator.schoolID)
					throw new Error("Coordinator not found");

				schoolID = coordinator.schoolID;
			}

			try {
				const bus = new WayTrack.Bus();
				const buses = await bus.listBuses({ schoolID });

				return res.status(200).json({
					success: true,
					message: "SUCCESS",
					data: {
						buses: buses,
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

router.post(
	"/:schoolID/bus",
	allowAccess(["power", "coordinator"]),
	async (req, res) => {
		try {
			const payload = await auth(req);
			let schoolID = req.params.schoolID;

			if (payload.role == "coordinator") {
				const coordinator = new WayTrack.Coordinator();
				await coordinator.getCoordinator(payload.id);

				if (!coordinator.id || !coordinator.schoolID)
					throw new Error("Coordinator not found");

				schoolID = coordinator.schoolID;
			}

			let reqBody = req.body;
			reqBody.schoolID = schoolID;

			try {
				const busObject = z
					.object({
						registrationNo: z.string(),
						busNo: z.string(),
						driverID: z.string(),
						schoolID: z.string(),
					})
					.strict()
					.parse(reqBody);

				try {
					const bus = new WayTrack.Bus();
					await bus.create(busObject);

					if (!bus.id) throw new Error("Bus not created");

					return res.status(200).json({
						success: true,
						message: "SUCCESS",
						data: {
							bus: {
								id: bus.id,
								registrationNo: bus.registrationNo,
								busNo: bus.busNo,
								driverID: bus.driverID,
								schoolID: bus.schoolID,
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

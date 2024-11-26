import express from "express";
import allowAccess from "../../../../../functions/allowAccess";
import auth from "../../../../../functions/auth";
import { WayTrack } from "../../../../../classes/WayTrack";
import { APIErrors } from "../../../../../classes/APIErrors";
import { location } from "../../../../Location";

const router = express.Router();

router.patch("/:busID/location", allowAccess(["driver"]), async (req, res) => {
	try {
		const payload = await auth(req);

		try {
			const driver = new WayTrack.Driver();
			await driver.getDriver({ id: payload.id });

			if (!driver.id) throw new Error("Driver not found");

			const bus = new WayTrack.Bus();
			await bus.getByDriver({ driverID: driver.id });

			if (!bus.id) throw new Error("Bus not found");

			const { latitude, longitude } = req.body;

			if (!latitude || !longitude)
				throw new Error("Latitude or Longitude not found");

			location[bus.id] = {
				latitude,
				longitude,
			};

			return res.status(200).json({
				success: true,
				message: "SUCCESS",
				data: {
					location: location[bus.id],
				},
			});
		} catch (e) {
			return res.status(400).json(APIErrors.DB_ERROR(e));
		}
	} catch (e) {
		return res.status(400).json(APIErrors.UNAUTHORIZED(e));
	}
});

export default router;

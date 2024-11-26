import express from "express";
import allowAccess from "../../../../functions/allowAccess";
import auth from "../../../../functions/auth";
import student from "../student";
import { WayTrack } from "../../../../classes/WayTrack";
import { APIErrors } from "../../../../classes/APIErrors";
import { location } from "../../../Location";

const router = express.Router();

router.get(
	"/:studentID/location",
	allowAccess(["power", "coordinator", "student"]),
	async (req, res) => {
		let studentID = req.params.studentID;
		const payload = await auth(req);

		try {
			if (payload.role === "student") {
				studentID = payload.id;
			}

			const student = new WayTrack.Student();
			await student.getStudent({ id: studentID });

			const busID = student.busID;

			if (!busID) throw new Error("Bus not found");

			if (!location[busID]) throw new Error("Bus not found");

			return res.status(200).json({
				success: true,
				message: "SUCCESS",
				data: {
					location: location[busID],
				},
			});
		} catch (e) {
			return res.status(400).json(APIErrors.DB_ERROR(e));
		}
	},
);

export default router;

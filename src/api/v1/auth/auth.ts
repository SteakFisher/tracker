import express from "express";
import { z } from "zod";
import { WayTrack } from "../../../classes/WayTrack";
import bcrypt from "bcrypt";
import { APIErrors } from "../../../classes/APIErrors";
import allowAccess from "../../../functions/allowAccess";
import { signJWT } from "../../../functions/JWT";
import auth from "../../../functions/auth";

const router = express.Router();

router.post("/login", async (req, res) => {
	try {
		const body = z
			.object({
				email: z.string(),
				password: z.string(),
			})
			.parse(req.body);

		try {
			const user = new WayTrack.User();
			await user.getUser({ email: body.email });

			try {
				if (!user.id || !user.email || !user.password || !user.role)
					throw new Error("User not found");

				const match = await bcrypt.compare(body.password, user.password);

				if (!match) throw new Error("Incorrect password");

				const jwt = await signJWT({
					id: user.id,
					email: user.email,
					role: user.role,
				});

				return res
					.cookie("access_token", jwt, {
						httpOnly: true,
					})
					.send({
						error: false,
						success_prop: {
							message: "User logged in successfully",
							data: {
								id: user.id,
								email: user.email,
								image: user.image,
								role: user.role,
							},
						},
					})
					.status(201);
			} catch (e) {
				return res.status(400).json(APIErrors.GENERIC(e));
			}
		} catch (e) {
			return res.status(400).json(APIErrors.DB_ERROR(e));
		}
	} catch (e) {
		return res.status(400).json(APIErrors.INVALID_REQUEST_BODY(e));
	}
});

router.post(
	"/signup",
	allowAccess(["power", "coordinator"]),
	async (req, res) => {
		try {
			const payload = await auth(req);
			try {
				const signUpObject = z
					.object({
						user: z
							.object({
								email: z.string(),
								password: z.string(),
								image: z.string().optional(),
								role: z.union([
									z.literal("coordinator"),
									z.literal("driver"),
								]),
							})
							.strict(),
						roleData: z.any(),
					})
					.strict()
					.parse(req.body);

				try {
					if (signUpObject.user.role === "coordinator") {
						if (!["power"].includes(payload.role)) {
							return res
								.status(405)
								.json(
									APIErrors.UNAUTHORIZED(
										"You do not have access to that resource",
									),
								);
						}

						const coordinatorData = z
							.object({
								name: z.string(),
								schoolID: z.string(),
							})
							.strict()
							.parse(signUpObject.roleData);

						const coordinator = new WayTrack.Coordinator();
						await coordinator.create({
							email: signUpObject.user.email,
							password: signUpObject.user.password,
							image: signUpObject.user.image,
							name: coordinatorData.name,
							schoolID: coordinatorData.schoolID,
						});

						if (!coordinator.id)
							throw new Error("Coordinator not created");

						return res.status(200).json({
							success: true,
							message: "SUCCESS",
							data: {
								user: {
									id: coordinator.id,
									email: coordinator.email,
									image: coordinator.image,
									role: coordinator.role,
								},
							},
						});
					} else if (signUpObject.user.role === "driver") {
						if (!["power", "coordinator"].includes(payload.role)) {
							return res
								.status(405)
								.json(
									APIErrors.UNAUTHORIZED(
										"You do not have access to that resource",
									),
								);
						}

						if (payload.role === "coordinator") {
							const coordinator = new WayTrack.Coordinator();
							await coordinator.getCoordinator(payload.id);

							if (!coordinator.id)
								throw new Error("Coordinator not found");

							signUpObject.roleData.schoolID = coordinator.schoolID;
						}

						const driverData = z
							.object({
								name: z.string(),
								contactNo: z.string(),
								schoolID: z.string(),
							})
							.strict()
							.parse(signUpObject.roleData);

						const driver = new WayTrack.Driver();
						await driver.create({
							email: signUpObject.user.email,
							password: signUpObject.user.password,
							image: signUpObject.user.image,
							name: driverData.name,
							contactNo: driverData.contactNo,
							schoolID: driverData.schoolID,
						});

						if (!driver.id) throw new Error("Driver not created");

						return res.status(200).json({
							success: true,
							message: "SUCCESS",
							data: {
								user: {
									id: driver.id,
									email: driver.email,
									image: driver.image,
									role: driver.role,
								},
							},
						});
					}
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

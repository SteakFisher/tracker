import { NextFunction, Request, Response } from "express";
import { Payload } from "../types/Payload";
import { signJWT, verifyJWT } from "./JWT";
import { APIErrors } from "../classes/APIErrors";

export default function (roles: Payload["role"][]) {
	return async (req: Request, res: Response, next: NextFunction) => {
		let jwt = req.cookies["access_token"];

		if (jwt) {
			try {
				const payload = await verifyJWT(jwt);
				console.log(payload.role);

				if (!roles.includes(payload.role)) {
					return res
						.send(
							APIErrors.UNAUTHORIZED(
								"You do not have access to that resource",
							),
						)
						.status(405);
				}

				const refreshedJWT = await signJWT({
					id: payload.id,
					email: payload.email,
					role: payload.role,
				});

				res.cookie("access_token", refreshedJWT, {
					httpOnly: true,
				});

				return next();
			} catch (e) {
				return res
					.send(
						APIErrors.UNAUTHORIZED(
							"JWT Token expired, please login again",
						),
					)
					.status(405);
			}
		} else {
			return res
				.send(
					APIErrors.UNAUTHORIZED(
						"You do not have access to that resource",
					),
				)
				.status(405);
		}
	};
}

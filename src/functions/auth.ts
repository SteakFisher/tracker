import { Request } from "express";
import { verifyJWT } from "./JWT";

export default async function auth(req: Request) {
	return await verifyJWT(req.cookies["access_token"]);
}

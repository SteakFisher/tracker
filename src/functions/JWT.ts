import process from "node:process";
import * as jose from "jose";
import { Payload } from "../types/Payload";

export async function verifyJWT(jwt: string) {
	const secret = new TextEncoder().encode(process.env.AUTH_SECRET);
	try {
		const { payload }: { payload: Payload } = await jose.jwtVerify(
			jwt,
			secret,
		);
		return payload;
	} catch (e: any) {
		throw new Error(e.toString());
	}
}

export async function signJWT(payload: Payload) {
	const secret = new TextEncoder().encode(process.env.AUTH_SECRET);
	const alg = "HS256";

	return await new jose.SignJWT(payload)
		.setProtectedHeader({ alg })
		.setIssuedAt()
		.setExpirationTime("4w")
		.sign(secret);
}

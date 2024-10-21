import { db as Supabase } from "../../drizzle";
import bcrypt from "bcrypt";
import { roleTable, userTable } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { Payload } from "../types/Payload";

export interface IUser {
	id?: string;
	email?: string;
	password?: string;
	image?: string;
	role?: Payload["role"];

	getUser(
		this: User,
		{
			id,
			email,
		}: { id?: string; email?: string } & ({ id: string } | { email: string }),
		db?: typeof Supabase,
	): Promise<typeof this | undefined>;
}

export class User implements IUser {
	id: string | undefined;
	email: string | undefined;
	password: string | undefined;
	image: string | undefined;
	role: Payload["role"] | undefined;

	async getUser(
		{
			id,
			email,
		}: { id?: string; email?: string } & ({ id: string } | { email: string }),
		db?: typeof Supabase,
	): Promise<typeof this | undefined> {
		if (!db) db = Supabase;

		let user:
			| {
					id: string;
					email: string;
					password: string;
					image: string | null;
					roleTable: {
						id: string;
						role: Payload["role"];
					};
			  }
			| undefined;
		if (id) {
			let smth = await db.query.userTable.findFirst({
				where: eq(userTable.id, id),
				with: {
					roleTable: true,
				},
			});
		} else if (email) {
			user = await db.query.userTable.findFirst({
				where: eq(userTable.email, email),
				with: {
					roleTable: true,
				},
			});
		} else {
			return undefined;
		}

		if (!user) return undefined;

		this.id = user.id;
		this.email = user.email;
		this.password = user.password;
		this.image = user.image || undefined;
		this.role = user.roleTable.role;

		return this;
	}

	protected async createUser(
		{
			email,
			password,
			image,
			role,
		}: {
			email: string;
			password: string;
			image?: string;
			role: "student" | "coordinator" | "power" | "driver";
		},
		db: typeof Supabase,
	): Promise<typeof this> {
		let hash = await bcrypt.hash(password, 10);

		const userID = await db.transaction(async (tx) => {
			const id = await tx
				.insert(userTable)
				.values({
					email: email,
					password: hash,
					image: image,
				})
				.returning({
					id: userTable.id,
				});

			await tx.insert(roleTable).values({ id: id[0].id, role: role });

			return id[0].id;
		});

		this.id = userID;
		this.email = email;
		this.password = hash;
		this.image = image;
		this.role = role;

		return this;
	}
}

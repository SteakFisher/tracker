import { driverTable } from "../../drizzle/schema";
import { WayTrack } from "./WayTrack";
import { IUser, User } from "./User";
import { APIErrors } from "./APIErrors";
import { db as Supabase } from "../../drizzle";
import { eq } from "drizzle-orm";

export interface IDriver extends IUser {
	name: string | undefined;
	contactNo: string | undefined;
	schoolID: string | undefined;

	create({
		email,
		password,
		image,
		name,
		schoolID,
	}: {
		email: string;
		password: string;
		image?: string;
		name: string;
		schoolID: string;
	}): Promise<void>;

	getDriver({ id }: { id: string }, db?: typeof Supabase): Promise<void>;

	listDriver(
		{
			schoolID,
		}: {
			schoolID: string;
		},
		db?: typeof Supabase,
	): Promise<Awaited<ReturnType<typeof Supabase.query.driverTable.findMany>>>;
}

export class Driver extends User implements IDriver {
	name: string | undefined;
	contactNo: string | undefined;
	schoolID: string | undefined;

	public async create({
		email,
		password,
		image,
		name,
		contactNo,
		schoolID,
	}: {
		email: string;
		password: string;
		image?: string;
		name: string;
		contactNo: string;
		schoolID: string;
	}) {
		const driver = await WayTrack.db.transaction(async (tx) => {
			const user: InstanceType<typeof User> = await super.createUser(
				{ email, password, image, role: "driver" },
				tx,
			);

			if (!user.id) throw APIErrors.DB_ERROR("User not created");

			return tx
				.insert(driverTable)
				.values({
					id: user.id,
					name,
					contactNo,
					schoolID,
				})
				.returning({
					id: driverTable.id,
					name: driverTable.name,
					contactNo: driverTable.contactNo,
					schoolID: driverTable.schoolID,
				});
		});

		this.name = driver[0].name;
		this.contactNo = driver[0].contactNo;
		this.schoolID = driver[0].schoolID;
	}

	async getDriver({ id }: { id: string }, db?: typeof Supabase) {
		if (!db) db = Supabase;
		const [_, driver] = await Promise.all([
			super.getUser({ id: id }),
			db.query.driverTable.findFirst({
				where: eq(driverTable.id, id),
			}),
		]);

		if (!driver) return;

		this.id = driver.id;
		this.name = driver.name;
		this.contactNo = driver.contactNo;
		this.schoolID = driver.schoolID;
	}

	async listDriver({ schoolID }: { schoolID: string }, db?: typeof Supabase) {
		if (!db) db = Supabase;
		return db.query.driverTable.findMany({
			where: eq(driverTable.schoolID, schoolID),
		});
	}
}

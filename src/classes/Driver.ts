import { driverTable } from "../../drizzle/schema";
import { WayTrack } from "./WayTrack";
import { IUser, User } from "./User";
import { APIErrors } from "./APIErrors";
import { School } from "./School";

export interface IDriver extends IUser {
	name: string | undefined;
	contactNo: string | undefined;
	schoolID: string | undefined;
	school: School | undefined;

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
}

export class Driver extends User implements IDriver {
	name: string | undefined;
	contactNo: string | undefined;
	schoolID: string | undefined;
	school: School | undefined;

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
}

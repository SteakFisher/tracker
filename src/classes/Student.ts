import { driverTable, studentTable } from "../../drizzle/schema";
import { WayTrack } from "./WayTrack";
import { IUser, User } from "./User";
import { APIErrors } from "./APIErrors";
import { School } from "./School";

export interface IStudent extends IUser {
	registrationNo: string | undefined;
	name: string | undefined;
	studentClass: string | undefined;
	stopID: string | undefined;
	busID: string | undefined;
	schoolID: string | undefined;

	create({
		email,
		password,
		image,
		registrationNo,
		name,
		studentClass,
		stopID,
		busID,
		schoolID,
	}: {
		email: string;
		password: string;
		image?: string;
		registrationNo: string;
		name: string;
		studentClass: string;
		stopID: string;
		busID: string;
		schoolID: string;
	}): Promise<void>;
}

export class Student extends User implements IStudent {
	registrationNo: string | undefined;
	name: string | undefined;
	studentClass: string | undefined;
	stopID: string | undefined;
	busID: string | undefined;
	schoolID: string | undefined;

	public async create({
		email,
		password,
		image,
		registrationNo,
		name,
		studentClass,
		stopID,
		busID,
		schoolID,
	}: {
		email: string;
		password: string;
		image?: string;
		registrationNo: string;
		name: string;
		studentClass: string;
		stopID: string;
		busID: string;
		schoolID: string;
	}) {
		const student = await WayTrack.db.transaction(async (tx) => {
			const user: InstanceType<typeof User> = await super.createUser(
				{ email, password, image, role: "student" },
				tx,
			);

			if (!user.id) throw APIErrors.DB_ERROR("User not created");

			return tx
				.insert(studentTable)
				.values({
					id: user.id,
					name,
					registrationNo,
					class: studentClass,
					stopID,
					busID,
					schoolID,
				})
				.returning({
					id: studentTable.id,
					registrationNo: studentTable.registrationNo,
					name: studentTable.name,
					class: studentTable.class,
					stopID: studentTable.stopID,
					busID: studentTable.busID,
					schoolID: studentTable.schoolID,
				});
		});

		this.registrationNo = student[0].registrationNo;
		this.name = student[0].name;
		this.studentClass = student[0].class;
		this.stopID = student[0].stopID;
		this.busID = student[0].busID;
		this.schoolID = student[0].schoolID;
	}
}

import { coordinatorTable } from "../../drizzle/schema";
import { WayTrack } from "./WayTrack";
import { User } from "./User";
import { APIErrors } from "./APIErrors";

export class Coordinator extends User {
	name: string | undefined;
	schoolID: string | undefined;

	public async create({
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
	}) {
		await WayTrack.db.transaction(async (tx) => {
			const user: InstanceType<typeof User> = await super.createUser(
				{ email, password, image, role: "coordinator" },
				tx,
			);

			if (!user.id) throw APIErrors.DB_ERROR("User not created");

			await tx
				.insert(coordinatorTable)
				.values({ id: user.id, name, schoolID });
		});

		this.name = name;
		this.schoolID = schoolID;
	}
}

import { coordinatorTable } from "../../drizzle/schema";
import { WayTrack } from "./WayTrack";
import { IUser, User } from "./User";
import { APIErrors } from "./APIErrors";
import { eq } from "drizzle-orm";

export interface ICoordinator extends IUser {
	name: string | undefined;
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
}

export class Coordinator extends User implements ICoordinator {
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
		const coordinator = await WayTrack.db.transaction(async (tx) => {
			const user: InstanceType<typeof User> = await super.createUser(
				{ email, password, image, role: "coordinator" },
				tx,
			);

			if (!user.id) throw APIErrors.DB_ERROR("User not created");

			return tx
				.insert(coordinatorTable)
				.values({ id: user.id, name, schoolID })
				.returning({
					id: coordinatorTable.id,
					name: coordinatorTable.name,
					schoolID: coordinatorTable.schoolID,
				});
		});

		this.name = coordinator[0].name;
		this.schoolID = coordinator[0].schoolID;
	}

	public async getCoordinator(coordinatorID: string) {
		const [_, coordinator] = await Promise.all([
			super.getUser({ id: coordinatorID }),
			WayTrack.db.query.coordinatorTable.findFirst({
				where: eq(coordinatorTable.id, coordinatorID),
			}),
		]);

		if (!coordinator) throw APIErrors.DB_ERROR("Coordinator not found");

		this.name = coordinator.name;
		this.schoolID = coordinator.schoolID;
	}
}

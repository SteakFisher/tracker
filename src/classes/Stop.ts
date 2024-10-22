import { db as Supabase } from "../../drizzle";
import { busStopTable, stopTable } from "../../drizzle/schema";

export interface IStop {
	id: string | undefined;
	name: string | undefined;
	latitude: string | undefined;
	longitude: string | undefined;
	busID: string | undefined;
	schoolID: string | undefined;

	create(
		data: {
			name: string;
			latitude: string;
			longitude: string;
			busID: string;
			schoolID: string;
		},
		db?: typeof Supabase,
	): Promise<void>;
}

export class Stop implements IStop {
	id: string | undefined;
	name: string | undefined;
	latitude: string | undefined;
	longitude: string | undefined;
	busID: string | undefined;
	schoolID: string | undefined;

	async create(
		data: {
			name: string;
			latitude: string;
			longitude: string;
			busID: string;
			schoolID: string;
		},
		db?: typeof Supabase,
	): Promise<void> {
		if (!db) db = Supabase;

		const stop = await db.transaction(async (tx) => {
			const ret = await tx.insert(stopTable).values(data).returning({
				id: stopTable.id,
				name: stopTable.name,
				latitude: stopTable.latitude,
				longitude: stopTable.longitude,
				busID: stopTable.busID,
				schoolID: stopTable.schoolID,
			});

			await tx.insert(busStopTable).values({
				stopID: ret[0].id,
				busID: data.busID,
			});

			return ret[0];
		});

		this.id = stop.id;
		this.name = stop.name;
		this.latitude = stop.latitude;
		this.longitude = stop.longitude;
		this.busID = stop.busID;
		this.schoolID = stop.schoolID;
	}
}

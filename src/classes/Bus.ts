import { db as Supabase } from "../../drizzle";
import { busTable } from "../../drizzle/schema";

export interface IBus {
	id: string | undefined;
	registrationNo: string | undefined;
	busNo: string | undefined;
	driverID: string | undefined;
	schoolID: string | undefined;

	create(
		data: {
			registrationNo: string;
			busNo: string;
			driverID: string;
			schoolID: string;
		},
		db?: typeof Supabase,
	): Promise<void>;
}

export class Bus implements IBus {
	id: string | undefined;
	registrationNo: string | undefined;
	busNo: string | undefined;
	driverID: string | undefined;
	schoolID: string | undefined;

	async create(
		data: {
			registrationNo: string;
			busNo: string;
			driverID: string;
			schoolID: string;
		},
		db?: typeof Supabase,
	) {
		if (!db) db = Supabase;

		const bus = await db.insert(busTable).values(data).returning({
			id: busTable.id,
			registrationNo: busTable.registrationNo,
			busNo: busTable.busNo,
			driverID: busTable.driverID,
			schoolID: busTable.schoolID,
		});

		this.id = bus[0].id;
		this.registrationNo = bus[0].registrationNo;
		this.busNo = bus[0].busNo;
		this.driverID = bus[0].driverID;
		this.schoolID = bus[0].schoolID;
	}
}

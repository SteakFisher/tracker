import { db as Supabase } from "../../drizzle";
import { busTable, stopTable } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

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

	getByStop(stopID: string, db?: typeof Supabase): Promise<void>;

	getByDriver(
		{ driverID }: { driverID: string },
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

	async getByStop(stopID: string, db?: typeof Supabase) {
		if (!db) db = Supabase;

		const bus = await db.query.stopTable.findFirst({
			where: eq(stopTable.id, stopID),
			columns: {
				id: true,
			},
			with: {
				busTable: true,
			},
		});

		if (!bus) throw new Error("Bus not found");

		this.id = bus.busTable.id;
		this.registrationNo = bus.busTable.registrationNo;
		this.busNo = bus.busTable.busNo;
		this.driverID = bus.busTable.driverID;
		this.schoolID = bus.busTable.schoolID;
	}

	async getByDriver({ driverID }: { driverID: string }, db?: typeof Supabase) {
		if (!db) db = Supabase;

		const bus = await db.query.busTable.findFirst({
			where: eq(busTable.driverID, driverID),
			columns: {
				id: true,
				registrationNo: true,
				busNo: true,
				driverID: true,
				schoolID: true,
			},
		});

		if (!bus) throw new Error("Bus not found");

		this.id = bus.id;
		this.registrationNo = bus.registrationNo;
		this.busNo = bus.busNo;
		this.driverID = bus.driverID;
		this.schoolID = bus.schoolID;
	}
}

import { db as Supabase } from "../../drizzle";
import { schoolTable } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

interface ISchool {
	id?: string;
	name?: string;
	location?: string;

	create(
		this: School,
		{ name, location }: { name: string; location: string },
		db?: typeof Supabase,
	): Promise<this>;

	get(
		{ id }: { id: string },
		db?: typeof Supabase,
	): Promise<Awaited<ReturnType<typeof Supabase.query.schoolTable.findFirst>>>;

	list(
		db?: typeof Supabase,
	): Promise<Awaited<ReturnType<typeof Supabase.query.schoolTable.findMany>>>;
}

export class School implements ISchool {
	id?: string;
	name?: string;
	location?: string;

	async create(
		{ name, location }: { name: string; location: string },
		db?: typeof Supabase,
	): Promise<this> {
		if (!db) db = Supabase;

		const school = await db
			.insert(schoolTable)
			.values({
				name,
				location,
			})
			.returning({
				id: schoolTable.id,
				name: schoolTable.name,
				location: schoolTable.location,
			});

		this.id = school[0].id;
		this.name = school[0].name;
		this.location = school[0].location;

		return this;
	}

	async get({ id }: { id: string }, db?: typeof Supabase) {
		if (!db) db = Supabase;

		return db.query.schoolTable.findFirst({
			where: eq(schoolTable.id, id),
		});
	}

	async list(db?: typeof Supabase) {
		if (!db) db = Supabase;

		return db.query.schoolTable.findMany();
	}
}

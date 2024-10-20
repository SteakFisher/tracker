import { db as Supabase } from "../../drizzle/index";
import { coordinatorTable } from "../../drizzle/schema";
import UserClass from "./User";
import CoordinatorClass from "./Coordinator";

export class WayTrack {
	static db = Supabase;

	static User = UserClass;

	static Coordinator = CoordinatorClass;
}

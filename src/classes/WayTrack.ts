import { db as Supabase } from "../../drizzle/index";
import { User as UserClass } from "./User";
import { Coordinator as CoordinatorClass } from "./Coordinator";

export class WayTrack {
	static db = Supabase;

	static User = UserClass;

	static Coordinator = CoordinatorClass;
}

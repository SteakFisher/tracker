import { db as Supabase } from "../../drizzle/index";
import { User as UserClass } from "./User";
import { Coordinator as CoordinatorClass } from "./Coordinator";
import { School as SchoolClass } from "./School";
import { Driver as DriverClass } from "./Driver";
import { Bus as BusClass } from "./Bus";

export class WayTrack {
	static db = Supabase;

	static User = UserClass;

	static Coordinator = CoordinatorClass;

	static School = SchoolClass;

	static Driver = DriverClass;

	static Bus = BusClass;
}

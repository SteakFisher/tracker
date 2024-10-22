import { pgTable } from "drizzle-orm/pg-core/table";
import { PgColumn, PgTableWithColumns, text, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm/relations";
import { AnyTable } from "drizzle-orm";

export const userTable = pgTable("user", {
	id: uuid("id").primaryKey().defaultRandom(),
	email: text("email").unique().notNull(),
	password: text("password").notNull(),
	image: text("image").default("https://i.imgur.com/Ifj5jtR.png"),
});

export const roleTable = pgTable("role", {
	id: uuid("id")
		.primaryKey()
		.references(() => userTable.id, { onDelete: "cascade" }),
	role: text("role", {
		enum: ["student", "coordinator", "power", "driver"],
	}).notNull(),
});

export const powerTable = pgTable("power", {
	id: uuid("id")
		.primaryKey()
		.references(() => userTable.id, { onDelete: "cascade" }),
	name: text("name").notNull(),
});

export const userRoleRelation = relations(userTable, ({ one }) => ({
	roleTable: one(roleTable, {
		fields: [userTable.id],
		references: [roleTable.id],
		relationName: "UserRoleRelation",
	}),
	coordinatorTable: one(coordinatorTable, {
		fields: [userTable.id],
		references: [coordinatorTable.id],
		relationName: "CoordinatorUserRelation",
	}),
	driverTable: one(driverTable, {
		fields: [userTable.id],
		references: [driverTable.id],
		relationName: "DriverUserRelation",
	}),
	powerTable: one(powerTable, {
		fields: [userTable.id],
		references: [powerTable.id],
		relationName: "PowerUserRelation",
	}),
}));

export const coordinatorTable = pgTable("coordinator", {
	id: uuid("id")
		.primaryKey()
		.references(() => userTable.id, { onDelete: "cascade" }),
	name: text("name").notNull(),
	schoolID: uuid("schoolID")
		.references(() => schoolTable.id, {
			onDelete: "cascade",
		})
		.notNull(),
});

export const coordinatorRelation = relations(coordinatorTable, ({ one }) => ({
	schoolTable: one(schoolTable, {
		fields: [coordinatorTable.schoolID],
		references: [schoolTable.id],
		relationName: "CoordinatorSchoolWeirdRelation",
	}),
	userTable: one(userTable, {
		fields: [coordinatorTable.id],
		references: [userTable.id],
		relationName: "CoordinatorUserRelation",
	}),
}));

export const schoolTable = pgTable("school", {
	id: uuid("id").primaryKey().defaultRandom(),
	name: text("name").unique().notNull(),
	image: text("image").default("https://i.imgur.com/pPaFbR2.jpeg"),
	location: text("location").notNull(),
});

export const schoolRelation = relations(schoolTable, ({ many }) => ({
	coordinatorTable: many(coordinatorTable, {
		relationName: "SchoolCoordinatorRelation",
	}),
	driverTable: many(driverTable, {
		relationName: "SchoolDriverRelation",
	}),
	busTable: many(busTable, {
		relationName: "SchoolBusRelation",
	}),
}));

export const busTable = pgTable("bus", {
	id: uuid("id").primaryKey().defaultRandom(),
	registrationNo: text("registrationNo").unique().notNull(),
	busNo: text("busNo").notNull(),
	driverID: uuid("driverID")
		.references(() => driverTable.id, {
			onDelete: "cascade",
		})
		.notNull(),
	schoolID: uuid("schoolID")
		.references(() => schoolTable.id, { onDelete: "cascade" })
		.notNull(),
});

export const driverTable = pgTable("driver", {
	id: uuid("id")
		.primaryKey()
		.references(() => userTable.id, { onDelete: "cascade" }),
	name: text("name").notNull(),
	contactNo: text("contactNo").notNull(),
	schoolID: uuid("schoolID")
		.references(() => schoolTable.id, {
			onDelete: "cascade",
		})
		.notNull(),
});

export const driverRelation = relations(driverTable, ({ one }) => ({
	schoolTable: one(schoolTable, {
		fields: [driverTable.schoolID],
		references: [schoolTable.id],
		relationName: "DriverSchoolRelation",
	}),
	userTable: one(userTable, {
		fields: [driverTable.id],
		references: [userTable.id],
		relationName: "DriverUserRelation",
	}),
}));

export const busRelation = relations(busTable, ({ one }) => ({
	schoolTable: one(schoolTable, {
		fields: [busTable.schoolID],
		references: [schoolTable.id],
		relationName: "BusSchoolRelation",
	}),
}));

export const stopTable = pgTable("stop", {
	id: uuid("id").primaryKey().defaultRandom(),
	name: text("name").notNull(),
	latitude: text("latitude").notNull(),
	longitude: text("longitude").notNull(),
	busID: uuid("busID")
		.references(() => busTable.id, { onDelete: "cascade" })
		.notNull(),
	schoolID: uuid("schoolID")
		.references(() => schoolTable.id, {
			onDelete: "cascade",
		})
		.notNull(),
});

export const busStopTable = pgTable("bus-stop", {
	id: uuid("id").primaryKey().defaultRandom(),
	busID: uuid("busID")
		.references(() => busTable.id, { onDelete: "cascade" })
		.notNull(),
	stopID: uuid("stopID")
		.references(() => stopTable.id, { onDelete: "cascade" })
		.notNull(),
});

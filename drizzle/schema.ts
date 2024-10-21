import { pgTable } from "drizzle-orm/pg-core/table";
import { text, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm/relations";

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

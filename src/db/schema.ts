import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const karyawan = sqliteTable("karyawan", {
    id: text("id").primaryKey(),
    nama: text("nama").notNull(),
    posisi: text("posisi").notNull(),
    createdAt: text("created_at").notNull(),
});

export type KaryawanSelect = typeof karyawan.$inferSelect;
export type KaryawanInsert = typeof karyawan.$inferInsert;
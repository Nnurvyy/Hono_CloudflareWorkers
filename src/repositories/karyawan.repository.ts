import { eq } from "drizzle-orm";
import { karyawan } from "../db/schema";
import type { KaryawanSelect, KaryawanInsert } from "../db/schema";

// Opsional: Bikin interface (seperti di src/repositories/interfaces.ts)
export interface IKaryawanRepository {
    findById(id: string): Promise<KaryawanSelect | undefined>;
    findAll(): Promise<KaryawanSelect[]>;
    create(data: KaryawanInsert): Promise<KaryawanSelect>;
    update(id: string, data: Partial<KaryawanInsert>): Promise<KaryawanSelect | undefined>;
    delete(id: string): Promise<void>;
}

export class KaryawanRepository implements IKaryawanRepository {
    constructor(private db: any) { } // db menggunakan tipe DrizzleD1Database dari drizzle-orm/d1

    async findById(id: string): Promise<KaryawanSelect | undefined> {
        const result = await this.db.select().from(karyawan).where(eq(karyawan.id, id)).limit(1);
        return result[0];
    }

    async findAll(): Promise<KaryawanSelect[]> {
        return await this.db.select().from(karyawan);
    }

    async create(data: KaryawanInsert): Promise<KaryawanSelect> {
        const result = await this.db.insert(karyawan).values(data).returning();
        return result[0];
    }

    async update(id: string, data: Partial<KaryawanInsert>): Promise<KaryawanSelect | undefined> {
        const result = await this.db.update(karyawan).set(data).where(eq(karyawan.id, id)).returning();
        return result[0];
    }

    async delete(id: string): Promise<void> {
        await this.db.delete(karyawan).where(eq(karyawan.id, id));
    }
}
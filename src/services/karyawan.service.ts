import type { IKaryawanRepository } from "../repositories/karyawan.repository";
import type { KaryawanSelect } from "../db/schema";
// Asumsi kamu punya file utility untuk ID dan Waktu seperti di project Tektik
import { generateId, now } from "../utils/id"; 

export class KaryawanService {
    constructor(private karyawanRepo: IKaryawanRepository) { }

    async listKaryawan(): Promise<KaryawanSelect[]> {
        return this.karyawanRepo.findAll();
    }

    async getKaryawan(id: string): Promise<KaryawanSelect> {
        const data = await this.karyawanRepo.findById(id);
        if (!data) throw new Error("Karyawan tidak ditemukan");
        return data;
    }

    async createKaryawan(nama: string, posisi: string): Promise<KaryawanSelect> {
        return await this.karyawanRepo.create({
            id: generateId(),
            nama,
            posisi,
            createdAt: now(),
        });
    }

    async updateKaryawan(id: string, data: { nama?: string; posisi?: string }): Promise<KaryawanSelect> {
        // Cek apakah eksis
        await this.getKaryawan(id); 
        
        const updated = await this.karyawanRepo.update(id, data);
        if (!updated) throw new Error("Gagal mengupdate karyawan");
        return updated;
    }

    async deleteKaryawan(id: string): Promise<void> {
        await this.getKaryawan(id); // Memastikan data ada sebelum dihapus
        await this.karyawanRepo.delete(id);
    }
}
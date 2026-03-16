import type { D1Database } from "@cloudflare/workers-types";
import type { KaryawanService } from "./services/karyawan.service";

export type AppEnv = {
    Bindings: {
        DB: D1Database; // mengenalkan database D1 ke dalam project
    };
    Variables: {
        karyawanService: KaryawanService; // mengenalkan service agar bisa dipanggil pakai c.get()
    };
};
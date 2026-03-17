import { OpenAPIHono } from "@hono/zod-openapi";
import { swaggerUI } from "@hono/swagger-ui";
import { cors } from "hono/cors";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "./db/schema";
import type { AppEnv } from "./types";

// Repositories & Services
import { KaryawanRepository } from "./repositories/karyawan.repository";
import { KaryawanService } from "./services/karyawan.service";

// Routes
import karyawanRoutes from "./routes/karyawan.routes";

const app = new OpenAPIHono<AppEnv>();

// ─── CORS ────────────────────────────────────────────────────────────
// Mengizinkan aplikasi frontend (misal Vue/React) mengakses API ini
app.use(
  "*",
  cors({
    origin: (origin) => origin || "*",
    credentials: true,
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type"],
  })
);

// ─── DI Wiring (per-request) ────────────────────────────────────────
// Middleware ini akan berjalan untuk semua rute yang diawali dengan /api/
app.use("/api/*", async (c, next) => {
  // 1. Inisialisasi database D1 menggunakan Drizzle ORM
  const db = drizzle(c.env.DB, { schema });

  // 2. Inisialisasi Repository
  const karyawanRepo = new KaryawanRepository(db);

  // 3. Inisialisasi Service
  const karyawanService = new KaryawanService(karyawanRepo);

  // 4. Inject Service ke dalam Context Hono agar bisa dipanggil pakai c.get() di routes
  c.set("karyawanService", karyawanService);

  await next();
});

// ─── Mount Routes ────────────────────────────────────────────────────
// Menyambungkan rute karyawan. Path dikosongkan ("") karena di dalam 
// file karyawan.routes.ts path-nya sudah diset ke "/api/karyawan"
app.route("/api", karyawanRoutes);

// ─── OpenAPI Doc & Swagger UI ────────────────────────────────────────
// Ini untuk menghasilkan dokumentasi API otomatis!
app.doc("/doc", {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "API Data Karyawan",
    description: "REST API untuk Manajemen Data Karyawan menggunakan Hono & D1",
  },
  servers: [
    { url: "http://localhost:8787", description: "Local Environment" },
    { url: "https://test-app.mh217512.workers.dev", description: "Production Environment" }
  ]
});

// UI Swagger bisa diakses di http://localhost:8787/swagger
app.get("/swagger", swaggerUI({ url: "/doc" }));

// ─── Health Check ────────────────────────────────────────────────────
app.get("/", (c) => c.json({ status: "ok", message: "Karyawan API is running 🚀" }));

export default app;
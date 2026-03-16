import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import type { AppEnv } from "../types";
import {
    CreateKaryawanSchema,
    UpdateKaryawanSchema,
    KaryawanResponseSchema,
    KaryawanListSchema,
    ErrorSchema,
    MessageSchema
} from "../schemas/karyawan.schema";

const app = new OpenAPIHono<AppEnv>();

// ─── List Karyawan ─────────────────────────────────────────────────
app.openapi(
    createRoute({
        method: "get", path: "/karyawan", tags: ["Karyawan"],
        responses: { 200: { content: { "application/json": { schema: KaryawanListSchema } }, description: "List semua karyawan" } },
    }),
    async (c) => c.json(await c.get("karyawanService").listKaryawan(), 200)
);

// ─── Create Karyawan ────────────────────────────────────────────────
app.openapi(
    createRoute({
        method: "post", path: "/karyawan", tags: ["Karyawan"],
        request: { body: { content: { "application/json": { schema: CreateKaryawanSchema } } } },
        responses: {
            201: { content: { "application/json": { schema: KaryawanResponseSchema } }, description: "Karyawan dibuat" },
            400: { content: { "application/json": { schema: ErrorSchema } }, description: "Error" },
        },
    }),
    async (c) => {
        try {
            const { nama, posisi } = c.req.valid("json");
            return c.json(await c.get("karyawanService").createKaryawan(nama, posisi), 201);
        } catch (e: any) {
            return c.json({ error: e.message }, 400);
        }
    }
);

// ─── Update Karyawan ────────────────────────────────────────────────
app.openapi(
    createRoute({
        method: "put", path: "/karyawan/{id}", tags: ["Karyawan"],
        request: {
            params: z.object({ id: z.string() }),
            body: { content: { "application/json": { schema: UpdateKaryawanSchema } } },
        },
        responses: {
            200: { content: { "application/json": { schema: KaryawanResponseSchema } }, description: "Karyawan diupdate" },
            400: { content: { "application/json": { schema: ErrorSchema } }, description: "Error" },
        },
    }),
    async (c) => {
        try {
            return c.json(await c.get("karyawanService").updateKaryawan(c.req.valid("param").id, c.req.valid("json")), 200);
        } catch (e: any) {
            return c.json({ error: e.message }, 400);
        }
    }
);

// ─── Delete Karyawan ────────────────────────────────────────────────
app.openapi(
    createRoute({
        method: "delete", path: "/karyawan/{id}", tags: ["Karyawan"],
        request: { params: z.object({ id: z.string() }) },
        responses: {
            200: { content: { "application/json": { schema: MessageSchema } }, description: "Karyawan dihapus" },
            400: { content: { "application/json": { schema: ErrorSchema } }, description: "Error" },
        },
    }),
    async (c) => {
        try {
            await c.get("karyawanService").deleteKaryawan(c.req.valid("param").id);
            return c.json({ message: "Karyawan berhasil dihapus" }, 200);
        } catch (e: any) {
            return c.json({ error: e.message }, 400);
        }
    }
);

export default app;
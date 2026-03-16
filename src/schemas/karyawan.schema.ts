import { z } from "@hono/zod-openapi";

export const CreateKaryawanSchema = z.object({
    nama: z.string().min(1).openapi({ example: "Budi Santoso" }),
    posisi: z.string().min(1).openapi({ example: "Software Engineer" }),
});

export const UpdateKaryawanSchema = z.object({
    nama: z.string().min(1).optional().openapi({ example: "Budi S." }),
    posisi: z.string().min(1).optional().openapi({ example: "Senior Engineer" }),
});

export const KaryawanResponseSchema = z
    .object({
        id: z.string(),
        nama: z.string(),
        posisi: z.string(),
        createdAt: z.string(),
    })
    .openapi("Karyawan");

export const KaryawanListSchema = z.array(KaryawanResponseSchema).openapi("KaryawanList");

export const ErrorSchema = z.object({ error: z.string() }).openapi("Error");
export const MessageSchema = z.object({ message: z.string() }).openapi("Message");
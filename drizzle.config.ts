import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema.ts', // Memberitahu Drizzle di mana file skema kamu
  out: './drizzle',             // Folder tempat file SQL akan disimpan
  dialect: 'sqlite',            // D1 menggunakan format SQLite
});
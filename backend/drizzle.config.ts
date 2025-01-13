import { defineConfig } from "drizzle-kit";

export default defineConfig({
    dialect: "sqlite", // Укажи "sqlite" для Cloudflare D1
    schema: "./src/db/schema.ts", // Путь к файлу со схемой таблиц
    out: "./drizzle/migrations", // Папка для миграций
});
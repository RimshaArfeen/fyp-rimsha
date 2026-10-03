// prisma.config.ts
import "dotenv/config";  // <-- Add this at the top
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
});
import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs";
import os from "os";

function getDatabaseUrl(): string {
  // If running on Vercel serverless environment
  if (process.env.VERCEL) {
    try {
      const tmpDir = os.tmpdir();
      const tmpDbPath = path.join(tmpDir, "dev.db");

      if (!fs.existsSync(tmpDbPath)) {
        const bundledPaths = [
          path.join(process.cwd(), "prisma", "dev.db"),
          path.join(process.cwd(), "dev.db"),
        ];

        let copied = false;
        for (const src of bundledPaths) {
          if (fs.existsSync(src)) {
            try {
              fs.copyFileSync(src, tmpDbPath);
              copied = true;
              break;
            } catch (err) {
              console.warn("Could not copy bundled dev.db to tmp:", err);
            }
          }
        }

        if (!copied) {
          try {
            fs.writeFileSync(tmpDbPath, "");
          } catch (e) {
            console.warn("Could not touch tmp dev.db:", e);
          }
        }
      }
      return `file:${tmpDbPath}`;
    } catch {
      // Fallback
    }
  }

  return process.env.DATABASE_URL || "file:./dev.db";
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const dbUrl = getDatabaseUrl();

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: dbUrl,
      },
    },
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;

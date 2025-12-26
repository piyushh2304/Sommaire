import { Pool } from "@neondatabase/serverless";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";

dotenv.config({ path: ".env.local" });
dotenv.config();

async function migrate() {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
        console.error("Error: DATABASE_URL not found.");
        process.exit(1);
    }

    const pool = new Pool({ connectionString: databaseUrl });

    const schemaPath = path.join(process.cwd(), "schema.sql");
    const schemaSql = fs.readFileSync(schemaPath, "utf8");

    try {
        console.log("Applying schema...");

        // Handle existing incompatible users table
        try {
            await pool.query("ALTER TABLE users RENAME TO users_backup_" + Date.now());
            console.log("⚠️ Renamed existing 'users' table to backup to allow clean schema application.");
        } catch (e: any) {
            // Ignore if table doesn't exist
        }

        const statements = schemaSql
            .split(";")
            .map((s) => s.trim())
            .filter((s) => s.length > 0);

        for (const statement of statements) {
            if (statement.startsWith("--") && !statement.includes("\n")) continue;

            console.log(`Executing: ${statement.substring(0, 50)}...`);
            try {
                await pool.query(statement);
            } catch (err: any) {
                if (err.message.includes("already exists")) {
                    console.log("  -> Object already exists, skipping.");
                } else {
                    throw err;
                }
            }
        }
        console.log("✅ Schema applied successfully.");
    } catch (error) {
        console.error("Migration Error:", error);
    } finally {
        await pool.end();
    }
}

migrate();

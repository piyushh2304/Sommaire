import { Pool } from "@neondatabase/serverless";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config();

async function inspectTables() {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
        console.error("Error: DATABASE_URL not found.");
        process.exit(1);
    }

    const pool = new Pool({ connectionString: databaseUrl });

    try {
        console.log("Checking tables...");
        const res = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public';
    `);

        console.table(res.rows);

    } catch (error) {
        console.error("Inspection Error:", error);
    } finally {
        await pool.end();
    }
}

inspectTables();

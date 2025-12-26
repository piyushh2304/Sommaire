import { Pool } from "@neondatabase/serverless";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config();

async function inspect() {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
        console.error("Error: DATABASE_URL not found.");
        process.exit(1);
    }

    const pool = new Pool({ connectionString: databaseUrl });

    try {
        console.log("Inspecting 'users' table...");
        const res = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'users';
    `);

        if (res.rows.length === 0) {
            console.log("Table 'users' does not exist.");
        } else {
            console.table(res.rows);
        }

    } catch (error) {
        console.error("Inspection Error:", error);
    } finally {
        await pool.end();
    }
}

inspect();

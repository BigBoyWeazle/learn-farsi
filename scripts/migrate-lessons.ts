import "dotenv/config";
import { db } from "../db";
import { sql } from "drizzle-orm";
import * as fs from "fs";
import * as path from "path";

async function runMigration() {
  console.log("🔧 Running lessons table migration...\n");

  try {
    const sqlFile = path.join(__dirname, "create-lessons-tables.sql");
    const sqlContent = fs.readFileSync(sqlFile, "utf8");

    // Split by semicolons and execute each statement
    const statements = sqlContent
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    for (const statement of statements) {
      console.log(`Executing: ${statement.substring(0, 50)}...`);
      await db.execute(sql.raw(statement));
      console.log("✓ Success\n");
    }

    console.log("✅ Migration completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

runMigration();

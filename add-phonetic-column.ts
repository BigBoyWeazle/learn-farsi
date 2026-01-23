import "dotenv/config";
import postgres from "postgres";

const client = postgres(process.env.DATABASE_URL!);

async function addColumn() {
  try {
    await client`
      ALTER TABLE vocabulary 
      ADD COLUMN IF NOT EXISTS example_phonetic TEXT
    `;
    console.log("Column added successfully");
  } catch (error) {
    console.error("Error:", error);
  }
  await client.end();
}

addColumn();

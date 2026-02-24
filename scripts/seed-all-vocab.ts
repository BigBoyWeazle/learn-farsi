import "dotenv/config";
import { seedLevel1 } from "./seed-level1-vocab";
import { seedLevel2 } from "./seed-level2-vocab";
import { seedLevel3 } from "./seed-level3-vocab";
import { seedLevel4 } from "./seed-level4-vocab";
import { seedLevel5 } from "./seed-level5-vocab";

async function main() {
  console.log("=".repeat(60));
  console.log("  FARSI VOCABULARY SEEDER — Expanding to ~1000 words");
  console.log("=".repeat(60));

  let grandTotal = 0;

  grandTotal += await seedLevel1();
  grandTotal += await seedLevel2();
  grandTotal += await seedLevel3();
  grandTotal += await seedLevel4();
  grandTotal += await seedLevel5();

  console.log("\n" + "=".repeat(60));
  console.log("  ALL LEVELS COMPLETE!");
  console.log("=".repeat(60));
  console.log(`\n  Total new words added: ${grandTotal}`);
  console.log("  (Existing words were skipped)\n");

  process.exit(0);
}

main().catch((error) => {
  console.error("\n❌ Error during seeding:", error);
  process.exit(1);
});

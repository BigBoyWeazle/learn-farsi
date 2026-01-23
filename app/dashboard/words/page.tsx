import { auth } from "@/auth";
import { db } from "@/db";
import { vocabulary } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import WordsClient from "./words-client";

export default async function AllWordsPage() {
  const session = await auth();

  // Fetch all active vocabulary words
  const words = await db
    .select()
    .from(vocabulary)
    .where(eq(vocabulary.isActive, true))
    .orderBy(desc(vocabulary.createdAt));

  return <WordsClient words={words} />;
}

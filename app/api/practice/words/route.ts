import { NextResponse } from "next/server";
import { selectWordsForSession } from "@/lib/word-selection";

export async function GET(request: Request) {
  try {
    // Get current level from query params (sent from client with localStorage data)
    const { searchParams } = new URL(request.url);
    const currentLevel = parseInt(searchParams.get("level") || "1", 10);

    // Use smart word selection algorithm
    const words = await selectWordsForSession({
      sessionSize: 5,
      currentLevel,
    });

    return NextResponse.json({ words });
  } catch (error) {
    console.error("Error fetching practice words:", error);
    return NextResponse.json(
      { error: "Failed to fetch practice words" },
      { status: 500 }
    );
  }
}

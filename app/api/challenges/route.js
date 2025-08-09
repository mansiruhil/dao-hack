import { listChallengesFromDb } from "@/lib/db"

export async function GET() {
  // DB 
  try {
    const db = await listChallengesFromDb()
    if (db && db.length) {
      return Response.json({ challenges: db })
    }
  } catch (e) {
    console.error("DB list error:", e?.message || e)
  }

  // fallback to local
  const { fallbackChallenges } = await import("@/lib/challenges-fallback")
  return Response.json({ challenges: fallbackChallenges })
}

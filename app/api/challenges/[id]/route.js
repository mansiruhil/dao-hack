import { getChallengeFromDb } from "@/lib/db"

export async function GET(_req, { params }) {
  const id = params?.id
  if (!id) return new Response("missing id", { status: 400 })

  try {
    const c = await getChallengeFromDb(id)
    if (c) return Response.json({ challenge: c })
  } catch (e) {
    console.error("DB get error:", e?.message || e)
  }

  const { fallbackChallenges } = await import("@/lib/challenges-fallback")
  const c = fallbackChallenges.find((x) => x.id === id)
  if (!c) return new Response("not found", { status: 404 })
  return Response.json({ challenge: c })
}

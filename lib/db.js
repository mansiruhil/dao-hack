import { neon } from "@neondatabase/serverless"

const hasDb = !!process.env.DATABASE_URL
const sql = hasDb ? neon(process.env.DATABASE_URL) : null

export async function ensureSchema() {
  if (!sql) return
  await sql`
    create table if not exists challenges (
      id text primary key,
      title text not null,
      description text not null,
      difficulty text not null,
      entry_function text not null,
      starter_code text not null,
      image text not null,
      public_tests jsonb not null,
      hidden_tests jsonb not null
    );
  `
}

export async function listChallengesFromDb() {
  if (!sql) return null
  await ensureSchema()
  const rows = await sql`select * from challenges order by id`
  // Map DB columns to API shape
  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    description: r.description,
    difficulty: r.difficulty,
    entryFunction: r.entry_function,
    starterCode: r.starter_code,
    image: r.image,
    publicIOTests: r.public_tests,
    hiddenIOTests: r.hidden_tests,
  }))
}

export async function getChallengeFromDb(id) {
  if (!sql) return null
  await ensureSchema()
  const rows = await sql`select * from challenges where id = ${id} limit 1`
  const r = rows?.[0]
  if (!r) return null
  return {
    id: r.id,
    title: r.title,
    description: r.description,
    difficulty: r.difficulty,
    entryFunction: r.entry_function,
    starterCode: r.starter_code,
    image: r.image,
    publicIOTests: r.public_tests,
    hiddenIOTests: r.hidden_tests,
  }
}

export async function upsertChallenges(challenges) {
  if (!sql) return
  await ensureSchema()
  for (const c of challenges) {
    await sql`
      insert into challenges
      (id, title, description, difficulty, entry_function, starter_code, image, public_tests, hidden_tests)
      values (${c.id}, ${c.title}, ${c.description}, ${c.difficulty}, ${c.entryFunction}, ${c.starterCode}, ${c.image}, ${JSON.stringify(
        c.publicIOTests,
      )}::jsonb, ${JSON.stringify(c.hiddenIOTests)}::jsonb)
      on conflict (id) do update set
        title = excluded.title,
        description = excluded.description,
        difficulty = excluded.difficulty,
        entry_function = excluded.entry_function,
        starter_code = excluded.starter_code,
        image = excluded.image,
        public_tests = excluded.public_tests,
        hidden_tests = excluded.hidden_tests
    `
  }
}

import { neon } from "@neondatabase/serverless"

// seed using fallback dataset
import { fallbackChallenges } from "../lib/challenges-fallback.js"

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL not set. Aborting.")
    return
  }
  const sql = neon(process.env.DATABASE_URL)
  await sql`create table if not exists challenges (
    id text primary key,
    title text not null,
    description text not null,
    difficulty text not null,
    entry_function text not null,
    starter_code text not null,
    image text not null,
    public_tests jsonb not null,
    hidden_tests jsonb not null
  )`

  for (const c of fallbackChallenges) {
    await sql`
      insert into challenges
      (id, title, description, difficulty, entry_function, starter_code, image, public_tests, hidden_tests)
      values (
        ${c.id}, ${c.title}, ${c.description}, ${c.difficulty}, ${c.entryFunction}, ${c.starterCode}, ${c.image},
        ${JSON.stringify(c.publicIOTests)}::jsonb,
        ${JSON.stringify(c.hiddenIOTests)}::jsonb
      )
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
  console.log(`Seeded ${fallbackChallenges.length} challenges.`)
}

main().catch((e) => {
  console.error(e)
})

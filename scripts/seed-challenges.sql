-- schema for neon/postgres
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

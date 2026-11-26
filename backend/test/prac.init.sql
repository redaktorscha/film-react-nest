-- Run with psql. Connect as a role allowed to create the database,
-- or as prac after the database has already been created.
SELECT format('CREATE DATABASE %I OWNER %I', 'prac', 'prac')
WHERE NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = 'prac')
\gexec
\connect prac
SET ROLE prac;
BEGIN;
SET search_path TO public;

CREATE TABLE IF NOT EXISTS films (
  id uuid PRIMARY KEY,
  rating double precision NOT NULL,
  director text NOT NULL,
  tags text[] NOT NULL DEFAULT '{}',
  title text NOT NULL,
  about text NOT NULL,
  description text NOT NULL,
  image text NOT NULL,
  cover text NOT NULL
);

CREATE TABLE IF NOT EXISTS schedules (
  id uuid PRIMARY KEY,
  film_id uuid NOT NULL REFERENCES films(id) ON DELETE CASCADE,
  daytime text NOT NULL,
  hall integer NOT NULL,
  rows integer NOT NULL CHECK (rows > 0),
  seats integer NOT NULL CHECK (seats > 0),
  price integer NOT NULL CHECK (price >= 0),
  taken text[] NOT NULL DEFAULT '{}',
  UNIQUE (id, film_id)
);

CREATE INDEX IF NOT EXISTS schedules_film_id_idx ON schedules(film_id);

CREATE TABLE IF NOT EXISTS orders (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email text NOT NULL,
  phone text NOT NULL
);

CREATE TABLE IF NOT EXISTS order_tickets (
  id uuid PRIMARY KEY,
  order_id bigint NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  film_id uuid NOT NULL REFERENCES films(id),
  session_id uuid NOT NULL,
  daytime text NOT NULL,
  row integer NOT NULL CHECK (row > 0),
  seat integer NOT NULL CHECK (seat > 0),
  price integer NOT NULL CHECK (price >= 0),
  FOREIGN KEY (session_id, film_id) REFERENCES schedules(id, film_id),
  UNIQUE (session_id, row, seat)
);
COMMIT;

-- Users
CREATE TABLE IF NOT EXISTS users (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  created_at  TIMESTAMP DEFAULT NOW()
);

-- Daily logs
CREATE TABLE IF NOT EXISTS daily_logs (
  id              SERIAL PRIMARY KEY,
  user_id         INTEGER REFERENCES users(id),
  date            DATE NOT NULL DEFAULT CURRENT_DATE,

  -- Meals
  breakfast_food  TEXT,
  breakfast_time  VARCHAR(10),
  lunch_food      TEXT,
  lunch_time      VARCHAR(10),
  dinner_food     TEXT,
  dinner_time     VARCHAR(10),
  snack_food      TEXT,
  snack_time      VARCHAR(10),

  -- Water
  water_glasses   INTEGER DEFAULT 0,

  -- Movement
  steps           INTEGER,
  exercise_desc   TEXT,
  exercise_mins   INTEGER,

  -- Sleep
  sleep_time      VARCHAR(10),
  wake_time       VARCHAR(10),
  sleep_hours     NUMERIC(4,1),

  -- Wellbeing
  energy_level    VARCHAR(10),   -- 'low' | 'medium' | 'high'
  bloating        BOOLEAN,

  -- Flex meal
  flex_meal       TEXT,

  -- Completion flag
  completed       BOOLEAN DEFAULT FALSE,

  UNIQUE(user_id, date)
);

-- Weight logs (every 3 days)
CREATE TABLE IF NOT EXISTS weight_logs (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER REFERENCES users(id),
  date        DATE NOT NULL DEFAULT CURRENT_DATE,
  weight_kg   NUMERIC(5,2) NOT NULL,
  UNIQUE(user_id, date)
);

-- Body measurements (every 7 days)
CREATE TABLE IF NOT EXISTS measurements (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER REFERENCES users(id),
  date        DATE NOT NULL DEFAULT CURRENT_DATE,
  waist_cm    NUMERIC(5,1),
  hips_cm     NUMERIC(5,1),
  arms_cm     NUMERIC(5,1),
  UNIQUE(user_id, date)
);

-- Period logs (monthly)
CREATE TABLE IF NOT EXISTS period_logs (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER REFERENCES users(id),
  date        DATE NOT NULL,
  UNIQUE(user_id, date)
);

-- Trainer plan (single row, always update in place)
CREATE TABLE IF NOT EXISTS trainer_plan (
  id              SERIAL PRIMARY KEY,
  exercise_desc   TEXT,
  exercise_mins   INTEGER,
  sleep_hours     NUMERIC(4,1),
  daily_quote     TEXT,
  updated_at      TIMESTAMP DEFAULT NOW()
);

-- Skip foods
CREATE TABLE IF NOT EXISTS skip_foods (
  id      SERIAL PRIMARY KEY,
  name    VARCHAR(100) NOT NULL,
  reason  TEXT NOT NULL
);

-- Must-eat foods
CREATE TABLE IF NOT EXISTS must_eat_foods (
  id      SERIAL PRIMARY KEY,
  name    VARCHAR(100) NOT NULL,
  reason  TEXT NOT NULL
);

-- Seed one trainer plan row if not exists
INSERT INTO trainer_plan (exercise_desc, exercise_mins, sleep_hours, daily_quote)
SELECT 'Walk or light cardio', 30, 8, 'Every day is a fresh start.'
WHERE NOT EXISTS (SELECT 1 FROM trainer_plan);
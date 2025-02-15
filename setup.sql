CREATE TABLE IF NOT EXISTS sheets(
user_id TEXT NOT NULL,
sheet_id TEXT NOT NULL,
character_name TEXT NOT NULL,
active BOOLEAN DEFAULT NULL,
UNIQUE(user_id, character_name),
UNIQUE(user_id, active)
);

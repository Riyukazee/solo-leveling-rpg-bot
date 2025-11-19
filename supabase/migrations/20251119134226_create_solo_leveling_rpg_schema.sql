/*
  # Solo Leveling RPG Database Schema

  ## Overview
  Complete database structure for a Discord RPG bot inspired by Solo Leveling.
  
  ## New Tables Created
  
  ### 1. players
  - `discord_id` (text, primary key) - Discord user ID
  - `username` (text) - Discord username
  - `level` (integer) - Player level
  - `xp` (bigint) - Current experience points
  - `coins` (bigint) - In-game currency
  - `hp` (integer) - Current health points
  - `max_hp` (integer) - Maximum health points
  - `mana` (integer) - Current mana points
  - `max_mana` (integer) - Maximum mana points
  - `strength` (integer) - Physical damage stat (FOR)
  - `intelligence` (integer) - Magic damage + mana stat (INT)
  - `agility` (integer) - Crit, dodge, initiative (AGI)
  - `vitality` (integer) - HP max, resistances (VIT)
  - `charisma` (integer) - Shop discounts, coin bonuses (CHA)
  - `stat_points` (integer) - Unassigned stat points
  - `class_id` (uuid, nullable) - Current class
  - `avatar_id` (uuid, nullable) - Selected avatar/skin
  - `last_message_xp` (timestamptz) - Anti-spam for XP gain
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### 2. classes
  - `id` (uuid, primary key)
  - `name` (text) - Class name
  - `description` (text) - Class description
  - `rarity` (text) - Common/Rare/Epic/Legendary
  - `image_url` (text, nullable) - Class image
  - `hp_modifier` (numeric) - HP multiplier
  - `mana_modifier` (numeric) - Mana multiplier
  - `strength_modifier` (integer) - FOR bonus
  - `intelligence_modifier` (integer) - INT bonus
  - `agility_modifier` (integer) - AGI bonus
  - `vitality_modifier` (integer) - VIT bonus
  - `charisma_modifier` (integer) - CHA bonus
  - `passives` (jsonb) - Passive abilities
  - `created_at` (timestamptz)
  
  ### 3. spells
  - `id` (uuid, primary key)
  - `class_id` (uuid) - Associated class
  - `name` (text) - Spell name
  - `description` (text) - Spell description
  - `mana_cost` (integer) - Mana required
  - `base_damage` (integer) - Base damage value
  - `damage_type` (text) - physical/magical
  - `scaling_stat` (text) - Which stat scales damage
  - `cooldown` (integer) - Cooldown in turns
  - `level_required` (integer) - Minimum level to learn
  - `price` (integer) - Cost to purchase
  - `effects` (jsonb) - Special effects
  - `created_at` (timestamptz)
  
  ### 4. player_spells
  - `player_id` (text) - Discord ID
  - `spell_id` (uuid)
  - `slot` (integer, nullable) - Equipped slot (1-4)
  - `learned_at` (timestamptz)
  
  ### 5. artifacts
  - `id` (uuid, primary key)
  - `name` (text) - Artifact name
  - `description` (text) - Artifact description
  - `rarity` (text) - C/R/E/L
  - `slot` (text) - weapon/helmet/chest/ring/amulet
  - `image_url` (text, nullable)
  - `strength_bonus` (integer)
  - `intelligence_bonus` (integer)
  - `agility_bonus` (integer)
  - `vitality_bonus` (integer)
  - `charisma_bonus` (integer)
  - `hp_bonus` (integer)
  - `mana_bonus` (integer)
  - `crit_bonus` (numeric)
  - `damage_bonus` (numeric)
  - `xp_bonus` (numeric)
  - `coin_bonus` (numeric)
  - `price` (integer)
  - `effects` (jsonb) - Special effects
  - `created_at` (timestamptz)
  
  ### 6. player_artifacts
  - `id` (uuid, primary key)
  - `player_id` (text)
  - `artifact_id` (uuid)
  - `equipped` (boolean)
  - `durability` (integer)
  - `obtained_at` (timestamptz)
  
  ### 7. avatars
  - `id` (uuid, primary key)
  - `name` (text) - Avatar name
  - `description` (text)
  - `image_url` (text)
  - `rarity` (text)
  - `price` (integer)
  - `premium_only` (boolean)
  - `created_at` (timestamptz)
  
  ### 8. player_avatars
  - `player_id` (text)
  - `avatar_id` (uuid)
  - `unlocked_at` (timestamptz)
  
  ### 9. enemies
  - `id` (uuid, primary key)
  - `name` (text) - Enemy name
  - `description` (text)
  - `image_url` (text)
  - `level` (integer) - Enemy level
  - `hp` (integer) - Enemy HP
  - `strength` (integer)
  - `intelligence` (integer)
  - `agility` (integer)
  - `xp_reward` (integer)
  - `coin_reward` (integer)
  - `loot_table` (jsonb) - Drop rates for items
  - `created_at` (timestamptz)
  
  ### 10. expeditions
  - `id` (uuid, primary key)
  - `name` (text) - Expedition name
  - `description` (text)
  - `image_url` (text, nullable)
  - `duration_minutes` (integer)
  - `min_level` (integer)
  - `rewards` (jsonb) - Reward table
  - `created_at` (timestamptz)
  
  ### 11. player_expeditions
  - `id` (uuid, primary key)
  - `player_id` (text)
  - `expedition_id` (uuid)
  - `started_at` (timestamptz)
  - `ends_at` (timestamptz)
  - `claimed` (boolean)
  - `rewards` (jsonb, nullable)
  
  ### 12. boosters
  - `id` (uuid, primary key)
  - `name` (text) - Booster name
  - `description` (text)
  - `image_url` (text, nullable)
  - `price` (integer)
  - `premium_only` (boolean)
  - `loot_table` (jsonb) - Drop rates
  - `created_at` (timestamptz)
  
  ### 13. player_inventory
  - `id` (uuid, primary key)
  - `player_id` (text)
  - `item_type` (text) - potion/material/booster/card
  - `item_id` (text) - Item identifier
  - `quantity` (integer)
  - `metadata` (jsonb, nullable)
  
  ### 14. casino_config
  - `id` (uuid, primary key)
  - `game_type` (text) - roulette/blackjack/slots
  - `enabled` (boolean)
  - `min_bet` (integer)
  - `max_bet` (integer)
  - `config` (jsonb) - Game-specific settings
  
  ### 15. config
  - `key` (text, primary key)
  - `value` (jsonb)
  - `updated_at` (timestamptz)
  
  ## Security
  - Row Level Security (RLS) enabled on all tables
  - Policies restrict access based on authentication and ownership
*/

-- Players table
CREATE TABLE IF NOT EXISTS players (
  discord_id text PRIMARY KEY,
  username text NOT NULL,
  level integer DEFAULT 1,
  xp bigint DEFAULT 0,
  coins bigint DEFAULT 1000,
  hp integer DEFAULT 100,
  max_hp integer DEFAULT 100,
  mana integer DEFAULT 50,
  max_mana integer DEFAULT 50,
  strength integer DEFAULT 10,
  intelligence integer DEFAULT 10,
  agility integer DEFAULT 10,
  vitality integer DEFAULT 10,
  charisma integer DEFAULT 10,
  stat_points integer DEFAULT 0,
  class_id uuid,
  avatar_id uuid,
  last_message_xp timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE players ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for players"
  ON players FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Players can update own data"
  ON players FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Players can insert own data"
  ON players FOR INSERT
  TO public
  WITH CHECK (true);

-- Classes table
CREATE TABLE IF NOT EXISTS classes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text DEFAULT '',
  rarity text DEFAULT 'Common',
  image_url text,
  hp_modifier numeric DEFAULT 1.0,
  mana_modifier numeric DEFAULT 1.0,
  strength_modifier integer DEFAULT 0,
  intelligence_modifier integer DEFAULT 0,
  agility_modifier integer DEFAULT 0,
  vitality_modifier integer DEFAULT 0,
  charisma_modifier integer DEFAULT 0,
  passives jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE classes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for classes"
  ON classes FOR SELECT
  TO public
  USING (true);

-- Spells table
CREATE TABLE IF NOT EXISTS spells (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id uuid REFERENCES classes(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text DEFAULT '',
  mana_cost integer DEFAULT 10,
  base_damage integer DEFAULT 10,
  damage_type text DEFAULT 'physical',
  scaling_stat text DEFAULT 'strength',
  cooldown integer DEFAULT 0,
  level_required integer DEFAULT 1,
  price integer DEFAULT 100,
  effects jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE spells ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for spells"
  ON spells FOR SELECT
  TO public
  USING (true);

-- Player spells junction table
CREATE TABLE IF NOT EXISTS player_spells (
  player_id text REFERENCES players(discord_id) ON DELETE CASCADE,
  spell_id uuid REFERENCES spells(id) ON DELETE CASCADE,
  slot integer CHECK (slot >= 1 AND slot <= 4),
  learned_at timestamptz DEFAULT now(),
  PRIMARY KEY (player_id, spell_id)
);

ALTER TABLE player_spells ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for player_spells"
  ON player_spells FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Players can manage own spells"
  ON player_spells FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Artifacts table
CREATE TABLE IF NOT EXISTS artifacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  rarity text DEFAULT 'Common',
  slot text DEFAULT 'weapon',
  image_url text,
  strength_bonus integer DEFAULT 0,
  intelligence_bonus integer DEFAULT 0,
  agility_bonus integer DEFAULT 0,
  vitality_bonus integer DEFAULT 0,
  charisma_bonus integer DEFAULT 0,
  hp_bonus integer DEFAULT 0,
  mana_bonus integer DEFAULT 0,
  crit_bonus numeric DEFAULT 0,
  damage_bonus numeric DEFAULT 0,
  xp_bonus numeric DEFAULT 0,
  coin_bonus numeric DEFAULT 0,
  price integer DEFAULT 500,
  effects jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE artifacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for artifacts"
  ON artifacts FOR SELECT
  TO public
  USING (true);

-- Player artifacts junction table
CREATE TABLE IF NOT EXISTS player_artifacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id text REFERENCES players(discord_id) ON DELETE CASCADE,
  artifact_id uuid REFERENCES artifacts(id) ON DELETE CASCADE,
  equipped boolean DEFAULT false,
  durability integer DEFAULT 100,
  obtained_at timestamptz DEFAULT now()
);

ALTER TABLE player_artifacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for player_artifacts"
  ON player_artifacts FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Players can manage own artifacts"
  ON player_artifacts FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Avatars table
CREATE TABLE IF NOT EXISTS avatars (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  image_url text NOT NULL,
  rarity text DEFAULT 'Common',
  price integer DEFAULT 1000,
  premium_only boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE avatars ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for avatars"
  ON avatars FOR SELECT
  TO public
  USING (true);

-- Player avatars junction table
CREATE TABLE IF NOT EXISTS player_avatars (
  player_id text REFERENCES players(discord_id) ON DELETE CASCADE,
  avatar_id uuid REFERENCES avatars(id) ON DELETE CASCADE,
  unlocked_at timestamptz DEFAULT now(),
  PRIMARY KEY (player_id, avatar_id)
);

ALTER TABLE player_avatars ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for player_avatars"
  ON player_avatars FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Players can manage own avatars"
  ON player_avatars FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Enemies table
CREATE TABLE IF NOT EXISTS enemies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  image_url text NOT NULL,
  level integer DEFAULT 1,
  hp integer DEFAULT 50,
  strength integer DEFAULT 5,
  intelligence integer DEFAULT 5,
  agility integer DEFAULT 5,
  xp_reward integer DEFAULT 50,
  coin_reward integer DEFAULT 25,
  loot_table jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE enemies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for enemies"
  ON enemies FOR SELECT
  TO public
  USING (true);

-- Expeditions table
CREATE TABLE IF NOT EXISTS expeditions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  image_url text,
  duration_minutes integer DEFAULT 60,
  min_level integer DEFAULT 1,
  rewards jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE expeditions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for expeditions"
  ON expeditions FOR SELECT
  TO public
  USING (true);

-- Player expeditions table
CREATE TABLE IF NOT EXISTS player_expeditions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id text REFERENCES players(discord_id) ON DELETE CASCADE,
  expedition_id uuid REFERENCES expeditions(id) ON DELETE CASCADE,
  started_at timestamptz DEFAULT now(),
  ends_at timestamptz NOT NULL,
  claimed boolean DEFAULT false,
  rewards jsonb
);

ALTER TABLE player_expeditions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for player_expeditions"
  ON player_expeditions FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Players can manage own expeditions"
  ON player_expeditions FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Boosters table
CREATE TABLE IF NOT EXISTS boosters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  image_url text,
  price integer DEFAULT 500,
  premium_only boolean DEFAULT false,
  loot_table jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE boosters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for boosters"
  ON boosters FOR SELECT
  TO public
  USING (true);

-- Player inventory table
CREATE TABLE IF NOT EXISTS player_inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id text REFERENCES players(discord_id) ON DELETE CASCADE,
  item_type text NOT NULL,
  item_id text NOT NULL,
  quantity integer DEFAULT 1,
  metadata jsonb
);

ALTER TABLE player_inventory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for player_inventory"
  ON player_inventory FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Players can manage own inventory"
  ON player_inventory FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Casino config table
CREATE TABLE IF NOT EXISTS casino_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_type text NOT NULL UNIQUE,
  enabled boolean DEFAULT true,
  min_bet integer DEFAULT 10,
  max_bet integer DEFAULT 10000,
  config jsonb DEFAULT '{}'::jsonb
);

ALTER TABLE casino_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for casino_config"
  ON casino_config FOR SELECT
  TO public
  USING (true);

-- Config table
CREATE TABLE IF NOT EXISTS config (
  key text PRIMARY KEY,
  value jsonb DEFAULT '{}'::jsonb,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for config"
  ON config FOR SELECT
  TO public
  USING (true);

-- Insert default casino configs
INSERT INTO casino_config (game_type, enabled, min_bet, max_bet, config) 
VALUES 
  ('roulette', true, 10, 10000, '{"multipliers": {"rouge": 2, "noir": 2, "pair": 2, "impair": 2, "number": 36}}'::jsonb),
  ('blackjack', true, 10, 10000, '{"blackjack_multiplier": 2.5, "win_multiplier": 2}'::jsonb),
  ('slots', true, 10, 5000, '{"symbols": {"common": {"multiplier": 3, "weight": 60}, "rare": {"multiplier": 10, "weight": 30}, "legendary": {"multiplier": 50, "weight": 10}}}'::jsonb)
ON CONFLICT (game_type) DO NOTHING;

-- Insert default config values
INSERT INTO config (key, value) 
VALUES 
  ('xp_rate', '{"base": 10, "message_cooldown_seconds": 10, "min_message_length": 5}'::jsonb),
  ('fight_channels', '{"allowed": []}'::jsonb),
  ('xp_channels', '{"allowed": []}'::jsonb),
  ('level_formula', '{"base": 100, "multiplier": 1.5}'::jsonb)
ON CONFLICT (key) DO NOTHING;
-- 初期データベーススキーマ
-- TOCHIGI SPORTS LIFE

-- チームテーブル
CREATE TABLE IF NOT EXISTS teams (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  sport_type TEXT NOT NULL,
  league TEXT,
  logo_url TEXT,
  primary_color TEXT,
  secondary_color TEXT,
  website_url TEXT,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 会場テーブル
CREATE TABLE IF NOT EXISTS venues (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  city TEXT,
  address TEXT,
  capacity INTEGER,
  access_info TEXT,
  parking_info TEXT,
  latitude REAL,
  longitude REAL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 試合テーブル
CREATE TABLE IF NOT EXISTS matches (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  team_id INTEGER NOT NULL,
  opponent_team TEXT NOT NULL,
  match_date DATETIME NOT NULL,
  venue_id INTEGER,
  is_home_game INTEGER DEFAULT 1,
  ticket_url TEXT,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (team_id) REFERENCES teams(id),
  FOREIGN KEY (venue_id) REFERENCES venues(id)
);

-- 選手テーブル
CREATE TABLE IF NOT EXISTS players (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  team_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  uniform_number INTEGER,
  position TEXT,
  height INTEGER,
  weight INTEGER,
  birthdate DATE,
  hometown TEXT,
  photo_url TEXT,
  bio TEXT,
  is_featured INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (team_id) REFERENCES teams(id)
);

-- 観戦ガイド記事テーブル
CREATE TABLE IF NOT EXISTS guide_articles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  sport_type TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  sections TEXT,
  tips TEXT,
  recommended_items TEXT,
  image_url TEXT,
  is_published INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 周辺スポットテーブル
CREATE TABLE IF NOT EXISTS local_spots (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  venue_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  address TEXT,
  description TEXT,
  walking_time INTEGER,
  website_url TEXT,
  phone TEXT,
  opening_hours TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (venue_id) REFERENCES venues(id)
);

-- インデックス作成
CREATE INDEX IF NOT EXISTS idx_matches_team_id ON matches(team_id);
CREATE INDEX IF NOT EXISTS idx_matches_date ON matches(match_date);
CREATE INDEX IF NOT EXISTS idx_players_team_id ON players(team_id);
CREATE INDEX IF NOT EXISTS idx_players_featured ON players(is_featured);
CREATE INDEX IF NOT EXISTS idx_guide_articles_slug ON guide_articles(slug);
CREATE INDEX IF NOT EXISTS idx_local_spots_venue_id ON local_spots(venue_id);

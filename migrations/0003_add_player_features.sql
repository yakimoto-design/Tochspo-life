-- 選手特集機能の追加
-- player_featuresテーブルの作成

CREATE TABLE IF NOT EXISTS player_features (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  player_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  feature_date DATE,
  image_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (player_id) REFERENCES players(id)
);

CREATE INDEX IF NOT EXISTS idx_player_features_player_id ON player_features(player_id);
CREATE INDEX IF NOT EXISTS idx_player_features_date ON player_features(feature_date);

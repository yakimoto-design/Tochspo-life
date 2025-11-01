-- チームにホーム会場の関連付けを追加

ALTER TABLE teams ADD COLUMN home_venue_id INTEGER REFERENCES venues(id);

-- 各チームにホーム会場を設定
UPDATE teams SET home_venue_id = 1 WHERE id = 1;  -- 宇都宮ブレックス → ブレックスアリーナ宇都宮
UPDATE teams SET home_venue_id = 3 WHERE id = 2;  -- 栃木SC → 栃木県グリーンスタジアム
UPDATE teams SET home_venue_id = 4 WHERE id = 3;  -- H.C.栃木日光アイスバックス → 日光霧降アイスアリーナ
UPDATE teams SET home_venue_id = 5 WHERE id = 4;  -- 宇都宮ブリッツェン → 栃木県総合運動公園周辺
UPDATE teams SET home_venue_id = 6 WHERE id = 5;  -- 栃木ゴールデンブレーブス → 栃木グリーンスタジアム
UPDATE teams SET home_venue_id = 8 WHERE id = 6;  -- 栃木シティFC → 栃木県グリーンスタジアム

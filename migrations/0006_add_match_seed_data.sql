-- 試合データのシード投入
-- 各チームの今後の試合予定

-- 宇都宮ブレックス（バスケットボール）の試合
INSERT OR IGNORE INTO matches (team_id, opponent_team, match_date, venue_id, ticket_url, notes) VALUES
(1, '川崎ブレイブサンダース', '2025-11-15 18:00:00', 1, 'https://www.brex.jp/tickets', 'B.LEAGUE 2025-26シーズン ホームゲーム'),
(1, 'アルバルク東京', '2025-11-22 18:00:00', 1, 'https://www.brex.jp/tickets', 'B.LEAGUE 2025-26シーズン ホームゲーム'),
(1, '千葉ジェッツ', '2025-12-06 18:00:00', 1, 'https://www.brex.jp/tickets', 'B.LEAGUE 2025-26シーズン ホームゲーム'),
(1, '名古屋ダイヤモンドドルフィンズ', '2025-12-13 18:00:00', 1, 'https://www.brex.jp/tickets', 'B.LEAGUE 2025-26シーズン ホームゲーム');

-- 栃木SC（サッカー）の試合
INSERT OR IGNORE INTO matches (team_id, opponent_team, match_date, venue_id, ticket_url, notes) VALUES
(2, 'ヴァンフォーレ甲府', '2025-11-16 14:00:00', 2, 'https://www.tochigisc.jp/tickets', 'J2リーグ第38節'),
(2, 'モンテディオ山形', '2025-11-23 14:00:00', 2, 'https://www.tochigisc.jp/tickets', 'J2リーグ第39節'),
(2, '水戸ホーリーホック', '2025-11-30 14:00:00', 2, 'https://www.tochigisc.jp/tickets', 'J2リーグ第40節 栃木ダービー'),
(2, 'ジェフユナイテッド千葉', '2025-12-07 14:00:00', 2, 'https://www.tochigisc.jp/tickets', 'J2リーグ第41節');

-- H.C.栃木日光アイスバックス（アイスホッケー）の試合
INSERT OR IGNORE INTO matches (team_id, opponent_team, match_date, venue_id, ticket_url, notes) VALUES
(3, '東北フリーブレイズ', '2025-11-17 18:00:00', 4, 'https://www.icebucks.jp/tickets', 'アジアリーグアイスホッケー2025-26'),
(3, 'レッドイーグルス北海道', '2025-11-24 18:00:00', 4, 'https://www.icebucks.jp/tickets', 'アジアリーグアイスホッケー2025-26'),
(3, '横浜グリッツ', '2025-12-08 18:00:00', 4, 'https://www.icebucks.jp/tickets', 'アジアリーグアイスホッケー2025-26');

-- 栃木ゴールデンブレーブス（野球）の試合
INSERT OR IGNORE INTO matches (team_id, opponent_team, match_date, venue_id, ticket_url, notes) VALUES
(5, '福島レッドホープス', '2025-11-10 13:00:00', 7, 'https://www.golden-braves.net/tickets', 'BCリーグ 2025シーズン'),
(5, '群馬ダイヤモンドペガサス', '2025-11-17 13:00:00', 7, 'https://www.golden-braves.net/tickets', 'BCリーグ 2025シーズン'),
(5, '茨城アストロプラネッツ', '2025-11-24 13:00:00', 7, 'https://www.golden-braves.net/tickets', 'BCリーグ 2025シーズン');

-- 栃木シティフットボールクラブ（サッカー）の試合
INSERT OR IGNORE INTO matches (team_id, opponent_team, match_date, venue_id, ticket_url, notes) VALUES
(6, 'カターレ富山', '2025-11-10 14:00:00', 8, 'https://www.tochigi-city-fc.com/tickets', 'J3リーグ第30節'),
(6, 'FC岐阜', '2025-11-17 14:00:00', 8, 'https://www.tochigi-city-fc.com/tickets', 'J3リーグ第31節'),
(6, 'ガイナーレ鳥取', '2025-11-24 14:00:00', 8, 'https://www.tochigi-city-fc.com/tickets', 'J3リーグ第32節');

-- 選手テーブルにエピソードカラムを追加
-- プロフィールとは別に、選手の人柄がわかるエピソードを記録するため

ALTER TABLE players ADD COLUMN episode TEXT;

-- 既存の選手にサンプルエピソードを追加（オプション）
UPDATE players SET episode = 'チームメイトからは「キャプテン」と慕われ、試合前のミーティングでは必ず全員を鼓舞する言葉をかける。練習後も若手選手の相談に乗る姿が見られる。' WHERE id = 1;
UPDATE players SET episode = '試合前のルーティンとして必ずコートの中央で深呼吸をする。その姿を見てチームメイトも集中力が高まると語る。' WHERE id = 2;
UPDATE players SET episode = '地元栃木のファンを大切にし、試合後のファンサービスは誰よりも長い時間をかけることで知られている。' WHERE id = 13;
UPDATE players SET episode = '試合前夜は必ずパスタを食べるというジンクスを持つ。「炭水化物が力になる」が口癖。' WHERE id = 14;
UPDATE players SET episode = 'オフシーズンには地元の小学校でサッカー教室を開催。子どもたちとの触れ合いを大切にしている。' WHERE id = 41;
UPDATE players SET episode = '試合の日は必ず母親に電話をしてから会場に向かう。「母の声が一番の応援」と語る。' WHERE id = 42;

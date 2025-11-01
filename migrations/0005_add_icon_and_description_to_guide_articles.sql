-- ガイド記事にアイコンと説明文を追加

ALTER TABLE guide_articles ADD COLUMN icon TEXT DEFAULT 'fa-book';
ALTER TABLE guide_articles ADD COLUMN description TEXT;

-- 既存記事にアイコンと説明文を追加
UPDATE guide_articles SET 
  icon = 'fa-basketball-ball',
  description = 'スピード感と迫力満点！バスケットボールの魅力を知って、試合観戦を楽しもう'
WHERE id = 1;

UPDATE guide_articles SET 
  icon = 'fa-futbol',
  description = '世界中で愛されるサッカー。スタジアムの熱気を感じながら観戦しよう'
WHERE id = 2;

UPDATE guide_articles SET 
  icon = 'fa-hockey-puck',
  description = '氷上の格闘技！迫力のアイスホッケーを体感しよう'
WHERE id = 3;

UPDATE guide_articles SET 
  icon = 'fa-biking',
  description = '風を切って駆け抜ける！ロードレースの魅力と観戦のコツ'
WHERE id = 4;

UPDATE guide_articles SET 
  icon = 'fa-baseball-ball',
  description = '日本人に馴染み深い野球。球場の雰囲気を楽しみながら観戦しよう'
WHERE id = 5;

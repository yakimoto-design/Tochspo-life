import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'
import type { CloudflareBindings, Team, Match, Player, Venue, GuideArticle, LocalSpot } from './types'

const app = new Hono<{ Bindings: CloudflareBindings }>()

// CORS設定
app.use('/api/*', cors())

// 静的ファイル配信（キャッシュ無効化）
app.use('/static/*', async (c, next) => {
  const res = await next()
  if (res) {
    res.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    res.headers.set('Pragma', 'no-cache')
    res.headers.set('Expires', '0')
  }
  return res
})

app.use('/static/*', serveStatic({ root: './public' }))

// ==========================================
// APIルート
// ==========================================

/**
 * GET /api/teams - チーム一覧
 */
app.get('/api/teams', async (c) => {
  const teams = await c.env.DB.prepare(`
    SELECT t.*, v.name as venue_name 
    FROM teams t 
    LEFT JOIN venues v ON t.home_venue_id = v.id
  `).all()
  return c.json(teams.results)
})

/**
 * GET /api/teams/:id - チーム詳細
 */
app.get('/api/teams/:id', async (c) => {
  const id = parseInt(c.req.param('id'))
  const team = await c.env.DB.prepare('SELECT * FROM teams WHERE id = ?').bind(id).first()
  
  if (!team) {
    return c.json({ error: 'Team not found' }, 404)
  }
  
  return c.json(team)
})

/**
 * GET /api/matches - 試合一覧
 */
app.get('/api/matches', async (c) => {
  const matches = await c.env.DB.prepare(`
    SELECT m.*, t.name as team_name, t.sport_type, v.name as venue_name
    FROM matches m
    LEFT JOIN teams t ON m.team_id = t.id
    LEFT JOIN venues v ON m.venue_id = v.id
    ORDER BY m.match_date DESC
  `).all()
  return c.json(matches.results)
})

/**
 * GET /api/matches/upcoming - 今後の試合
 */
app.get('/api/matches/upcoming', async (c) => {
  const daysAhead = parseInt(c.req.query('days') || '7')
  const matches = await c.env.DB.prepare(`
    SELECT m.*, t.name as team_name, t.sport_type, t.primary_color, t.logo_url, v.name as venue_name, v.address
    FROM matches m
    LEFT JOIN teams t ON m.team_id = t.id
    LEFT JOIN venues v ON m.venue_id = v.id
    WHERE m.match_date >= datetime('now')
    AND m.match_date <= datetime('now', '+' || ? || ' days')
    AND m.is_home_game = 1
    ORDER BY m.match_date ASC
  `).bind(daysAhead).all()
  return c.json(matches.results)
})

/**
 * GET /api/players - 選手一覧
 */
app.get('/api/players', async (c) => {
  const teamId = c.req.query('team_id')
  
  let query = `
    SELECT p.*, t.name as team_name, t.sport_type 
    FROM players p
    LEFT JOIN teams t ON p.team_id = t.id
  `
  
  const params: any[] = []
  
  if (teamId) {
    query += ' WHERE p.team_id = ?'
    params.push(parseInt(teamId))
  }
  
  query += ' ORDER BY p.uniform_number ASC'
  
  const stmt = c.env.DB.prepare(query)
  const players = params.length > 0 ? await stmt.bind(...params).all() : await stmt.all()
  
  return c.json(players.results)
})

/**
 * GET /api/players/featured - 注目選手
 */
app.get('/api/players/featured', async (c) => {
  const players = await c.env.DB.prepare(`
    SELECT p.*, t.name as team_name, t.sport_type, t.primary_color
    FROM players p
    LEFT JOIN teams t ON p.team_id = t.id
    WHERE p.is_featured = 1
    ORDER BY RANDOM()
    LIMIT 12
  `).all()
  return c.json(players.results)
})

/**
 * GET /api/venues - 会場一覧
 */
app.get('/api/venues', async (c) => {
  const venues = await c.env.DB.prepare('SELECT * FROM venues ORDER BY name').all()
  return c.json(venues.results)
})

/**
 * GET /api/guides - 観戦ガイド一覧
 */
app.get('/api/guides', async (c) => {
  const guides = await c.env.DB.prepare(`
    SELECT * FROM guide_articles 
    WHERE is_published = 1 
    ORDER BY created_at DESC
  `).all()
  return c.json(guides.results)
})

/**
 * GET /api/guides/:slug - 観戦ガイド詳細
 */
app.get('/api/guides/:slug', async (c) => {
  const slug = c.req.param('slug')
  const guide = await c.env.DB.prepare('SELECT * FROM guide_articles WHERE slug = ?').bind(slug).first()
  
  if (!guide) {
    return c.json({ error: 'Guide not found' }, 404)
  }
  
  return c.json(guide)
})

/**
 * GET /api/local-spots - 周辺スポット一覧
 */
app.get('/api/local-spots', async (c) => {
  const venueId = c.req.query('venue_id')
  
  let query = `
    SELECT ls.*, v.name as venue_name
    FROM local_spots ls
    LEFT JOIN venues v ON ls.venue_id = v.id
  `
  
  const params: any[] = []
  
  if (venueId) {
    query += ' WHERE ls.venue_id = ?'
    params.push(parseInt(venueId))
  }
  
  query += ' ORDER BY ls.category, ls.name'
  
  const stmt = c.env.DB.prepare(query)
  const spots = params.length > 0 ? await stmt.bind(...params).all() : await stmt.all()
  
  return c.json(spots.results)
})

/**
 * GET /api/stats - サイト統計情報
 */
app.get('/api/stats', async (c) => {
  const teams = await c.env.DB.prepare('SELECT COUNT(*) as count FROM teams').first()
  const matches = await c.env.DB.prepare('SELECT COUNT(*) as count FROM matches WHERE match_date >= datetime("now")').first()
  const players = await c.env.DB.prepare('SELECT COUNT(*) as count FROM players').first()
  const guides = await c.env.DB.prepare('SELECT COUNT(*) as count FROM guide_articles WHERE is_published = 1').first()
  
  return c.json({
    teams: teams?.count || 0,
    upcoming_matches: matches?.count || 0,
    players: players?.count || 0,
    guides: guides?.count || 0
  })
})

// ==========================================
// 管理画面API（Basic認証付き）
// ==========================================

const ADMIN_USERNAME = 'admin'
const ADMIN_PASSWORD = 'tochigi2025'

function checkBasicAuth(authHeader: string | undefined): boolean {
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return false
  }
  
  const base64Credentials = authHeader.slice(6)
  const credentials = atob(base64Credentials)
  const [username, password] = credentials.split(':')
  
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD
}

app.use('/api/admin/*', async (c, next) => {
  const authHeader = c.req.header('Authorization')
  
  if (!checkBasicAuth(authHeader)) {
    return c.json({ error: 'Unauthorized' }, 401, {
      'WWW-Authenticate': 'Basic realm="Admin Area"'
    })
  }
  
  return next()
})

/**
 * POST /api/admin/teams - チーム追加
 */
app.post('/api/admin/teams', async (c) => {
  const { name, sport_type, league, logo_url, primary_color, secondary_color, website_url, description, home_venue_id } = await c.req.json()
  
  const result = await c.env.DB.prepare(`
    INSERT INTO teams (name, sport_type, league, logo_url, primary_color, secondary_color, website_url, description, home_venue_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(name, sport_type, league, logo_url, primary_color, secondary_color, website_url, description, home_venue_id).run()
  
  return c.json({ success: true, id: result.meta.last_row_id })
})

/**
 * PUT /api/admin/teams/:id - チーム更新
 */
app.put('/api/admin/teams/:id', async (c) => {
  const id = parseInt(c.req.param('id'))
  const { name, sport_type, league, logo_url, primary_color, secondary_color, website_url, description, home_venue_id } = await c.req.json()
  
  await c.env.DB.prepare(`
    UPDATE teams 
    SET name = ?, sport_type = ?, league = ?, logo_url = ?, primary_color = ?, secondary_color = ?, 
        website_url = ?, description = ?, home_venue_id = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).bind(name, sport_type, league, logo_url, primary_color, secondary_color, website_url, description, home_venue_id, id).run()
  
  return c.json({ success: true })
})

/**
 * DELETE /api/admin/teams/:id - チーム削除
 */
app.delete('/api/admin/teams/:id', async (c) => {
  const id = parseInt(c.req.param('id'))
  await c.env.DB.prepare('DELETE FROM teams WHERE id = ?').bind(id).run()
  return c.json({ success: true })
})

/**
 * POST /api/admin/matches - 試合追加
 */
app.post('/api/admin/matches', async (c) => {
  const { team_id, opponent_team, match_date, venue_id, ticket_url, notes } = await c.req.json()
  
  const result = await c.env.DB.prepare(`
    INSERT INTO matches (team_id, opponent_team, match_date, venue_id, is_home_game, ticket_url, notes)
    VALUES (?, ?, ?, ?, 1, ?, ?)
  `).bind(team_id, opponent_team, match_date, venue_id, ticket_url, notes).run()
  
  return c.json({ success: true, id: result.meta.last_row_id })
})

/**
 * POST /api/admin/matches/bulk - 試合一括追加（CSVインポート）
 */
app.post('/api/admin/matches/bulk', async (c) => {
  const { matches } = await c.req.json()
  
  for (const match of matches) {
    await c.env.DB.prepare(`
      INSERT INTO matches (team_id, opponent_team, match_date, venue_id, is_home_game, ticket_url, notes)
      VALUES (?, ?, ?, ?, 1, ?, ?)
    `).bind(match.team_id, match.opponent_team, match.match_date, match.venue_id, match.ticket_url, match.notes).run()
  }
  
  return c.json({ success: true, count: matches.length })
})

/**
 * PUT /api/admin/matches/:id - 試合更新
 */
app.put('/api/admin/matches/:id', async (c) => {
  const id = parseInt(c.req.param('id'))
  const { team_id, opponent_team, match_date, venue_id, ticket_url, notes } = await c.req.json()
  
  await c.env.DB.prepare(`
    UPDATE matches 
    SET team_id = ?, opponent_team = ?, match_date = ?, venue_id = ?, ticket_url = ?, notes = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).bind(team_id, opponent_team, match_date, venue_id, ticket_url, notes, id).run()
  
  return c.json({ success: true })
})

/**
 * DELETE /api/admin/matches/:id - 試合削除
 */
app.delete('/api/admin/matches/:id', async (c) => {
  const id = parseInt(c.req.param('id'))
  await c.env.DB.prepare('DELETE FROM matches WHERE id = ?').bind(id).run()
  return c.json({ success: true })
})

/**
 * POST /api/admin/players - 選手追加
 */
app.post('/api/admin/players', async (c) => {
  const { team_id, name, uniform_number, position, height, weight, birthdate, hometown, photo_url, bio, is_featured } = await c.req.json()
  
  const result = await c.env.DB.prepare(`
    INSERT INTO players (team_id, name, uniform_number, position, height, weight, birthdate, hometown, photo_url, bio, is_featured)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(team_id, name, uniform_number, position, height, weight, birthdate, hometown, photo_url, bio, is_featured || 0).run()
  
  return c.json({ success: true, id: result.meta.last_row_id })
})

/**
 * PUT /api/admin/players/:id - 選手更新
 */
app.put('/api/admin/players/:id', async (c) => {
  const id = parseInt(c.req.param('id'))
  const { team_id, name, uniform_number, position, height, weight, birthdate, hometown, photo_url, bio, is_featured } = await c.req.json()
  
  await c.env.DB.prepare(`
    UPDATE players 
    SET team_id = ?, name = ?, uniform_number = ?, position = ?, height = ?, weight = ?, birthdate = ?, 
        hometown = ?, photo_url = ?, bio = ?, is_featured = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).bind(team_id, name, uniform_number, position, height, weight, birthdate, hometown, photo_url, bio, is_featured, id).run()
  
  return c.json({ success: true })
})

/**
 * DELETE /api/admin/players/:id - 選手削除
 */
app.delete('/api/admin/players/:id', async (c) => {
  const id = parseInt(c.req.param('id'))
  await c.env.DB.prepare('DELETE FROM players WHERE id = ?').bind(id).run()
  return c.json({ success: true })
})

/**
 * POST /api/admin/venues - 会場追加
 */
app.post('/api/admin/venues', async (c) => {
  const { name, city, address, capacity, access_info, parking_info, latitude, longitude } = await c.req.json()
  
  const result = await c.env.DB.prepare(`
    INSERT INTO venues (name, city, address, capacity, access_info, parking_info, latitude, longitude)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(name, city, address, capacity, access_info, parking_info, latitude, longitude).run()
  
  return c.json({ success: true, id: result.meta.last_row_id })
})

/**
 * PUT /api/admin/venues/:id - 会場更新
 */
app.put('/api/admin/venues/:id', async (c) => {
  const id = parseInt(c.req.param('id'))
  const { name, city, address, capacity, access_info, parking_info, latitude, longitude } = await c.req.json()
  
  await c.env.DB.prepare(`
    UPDATE venues 
    SET name = ?, city = ?, address = ?, capacity = ?, access_info = ?, parking_info = ?, latitude = ?, longitude = ?,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).bind(name, city, address, capacity, access_info, parking_info, latitude, longitude, id).run()
  
  return c.json({ success: true })
})

/**
 * DELETE /api/admin/venues/:id - 会場削除
 */
app.delete('/api/admin/venues/:id', async (c) => {
  const id = parseInt(c.req.param('id'))
  await c.env.DB.prepare('DELETE FROM venues WHERE id = ?').bind(id).run()
  return c.json({ success: true })
})

/**
 * POST /api/admin/guides - ガイド記事追加
 */
app.post('/api/admin/guides', async (c) => {
  const { title, sport_type, slug, icon, description, content, sections, tips, recommended_items, image_url, is_published } = await c.req.json()
  
  const result = await c.env.DB.prepare(`
    INSERT INTO guide_articles (title, sport_type, slug, icon, description, content, sections, tips, recommended_items, image_url, is_published)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(title, sport_type, slug, icon, description, content, sections, tips, recommended_items, image_url, is_published || 1).run()
  
  return c.json({ success: true, id: result.meta.last_row_id })
})

/**
 * PUT /api/admin/guides/:id - ガイド記事更新
 */
app.put('/api/admin/guides/:id', async (c) => {
  const id = parseInt(c.req.param('id'))
  const { title, sport_type, slug, icon, description, content, is_published } = await c.req.json()
  
  await c.env.DB.prepare(`
    UPDATE guide_articles 
    SET title = ?, sport_type = ?, slug = ?, icon = ?, description = ?, content = ?, is_published = ?,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).bind(title, sport_type, slug, icon, description, content, is_published, id).run()
  
  return c.json({ success: true })
})

/**
 * DELETE /api/admin/guides/:id - ガイド記事削除
 */
app.delete('/api/admin/guides/:id', async (c) => {
  const id = parseInt(c.req.param('id'))
  await c.env.DB.prepare('DELETE FROM guide_articles WHERE id = ?').bind(id).run()
  return c.json({ success: true })
})

/**
 * POST /api/admin/local-spots - 周辺スポット追加
 */
app.post('/api/admin/local-spots', async (c) => {
  const { venue_id, name, category, address, description, walking_time, website_url, phone, opening_hours } = await c.req.json()
  
  const result = await c.env.DB.prepare(`
    INSERT INTO local_spots (venue_id, name, category, address, description, walking_time, website_url, phone, opening_hours)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(venue_id, name, category, address, description, walking_time, website_url, phone, opening_hours).run()
  
  return c.json({ success: true, id: result.meta.last_row_id })
})

/**
 * PUT /api/admin/local-spots/:id - 周辺スポット更新
 */
app.put('/api/admin/local-spots/:id', async (c) => {
  const id = parseInt(c.req.param('id'))
  const { venue_id, name, category, address, description, walking_time, website_url, phone, opening_hours } = await c.req.json()
  
  await c.env.DB.prepare(`
    UPDATE local_spots 
    SET venue_id = ?, name = ?, category = ?, address = ?, description = ?, walking_time = ?, 
        website_url = ?, phone = ?, opening_hours = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).bind(venue_id, name, category, address, description, walking_time, website_url, phone, opening_hours, id).run()
  
  return c.json({ success: true })
})

/**
 * DELETE /api/admin/local-spots/:id - 周辺スポット削除
 */
app.delete('/api/admin/local-spots/:id', async (c) => {
  const id = parseInt(c.req.param('id'))
  await c.env.DB.prepare('DELETE FROM local_spots WHERE id = ?').bind(id).run()
  return c.json({ success: true })
})

// ==========================================
// SEO対策ルート
// ==========================================

/**
 * GET /robots.txt - Robotsファイル
 */
app.get('/robots.txt', async (c) => {
  const siteUrl = c.req.url.split('/').slice(0, 3).join('/')
  
  return c.text(`User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/admin/

Sitemap: ${siteUrl}/sitemap.xml`)
})

/**
 * GET /sitemap.xml - サイトマップ
 */
app.get('/sitemap.xml', async (c) => {
  const siteUrl = c.req.url.split('/').slice(0, 3).join('/')
  
  // チーム一覧を取得
  const teams = await c.env.DB.prepare('SELECT id FROM teams').all()
  
  // ガイド記事一覧を取得
  const guides = await c.env.DB.prepare('SELECT slug FROM guide_articles WHERE is_published = 1').all()
  
  const teamUrls = teams.results.map((team: any) => `
  <url>
    <loc>${siteUrl}/team/${team.id}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('')
  
  const guideUrls = guides.results.map((guide: any) => `
  <url>
    <loc>${siteUrl}/guide/${guide.slug}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join('')
  
  return c.text(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>${teamUrls}${guideUrls}
</urlset>`, 200, { 'Content-Type': 'application/xml' })
})

// ==========================================
// フロントエンドページ
// ==========================================

/**
 * GET / - メインページ
 */
app.get('/', async (c) => {
  const siteUrl = c.req.url.split('/').slice(0, 3).join('/')
  
  return c.html(`<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
    
    <!-- Primary Meta Tags -->
    <title>とちスポLIFE - 栃木のプロスポーツをもっと身近に | TOCHIGI SPORTS LIFE</title>
    <meta name="title" content="とちスポLIFE - 栃木のプロスポーツをもっと身近に">
    <meta name="description" content="栃木県の6つのプロスポーツチーム（宇都宮ブレックス、栃木SC、H.C.栃木日光アイスバックス、宇都宮ブリッツェン、栃木ゴールデンブレーブス、栃木シティFC）の試合情報、選手情報、観戦ガイドを掲載。">
    <meta name="keywords" content="栃木,スポーツ,プロスポーツ,宇都宮ブレックス,栃木SC,アイスバックス,ブリッツェン,ゴールデンブレーブス,栃木シティFC,バスケットボール,サッカー,アイスホッケー,野球,サイクルロードレース">
    <meta name="author" content="とちスポLIFE">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="${siteUrl}/">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="${siteUrl}/">
    <meta property="og:title" content="とちスポLIFE - 栃木のプロスポーツをもっと身近に">
    <meta property="og:description" content="栃木県の6つのプロスポーツチームの試合情報、選手情報、観戦ガイドを掲載。宇都宮ブレックス、栃木SC、アイスバックスなど栃木のスポーツを応援しよう！">
    <meta property="og:image" content="${siteUrl}/static/og-image.png">
    <meta property="og:site_name" content="とちスポLIFE">
    <meta property="og:locale" content="ja_JP">
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:url" content="${siteUrl}/">
    <meta name="twitter:title" content="とちスポLIFE - 栃木のプロスポーツをもっと身近に">
    <meta name="twitter:description" content="栃木県の6つのプロスポーツチームの試合情報、選手情報、観戦ガイドを掲載。">
    <meta name="twitter:image" content="${siteUrl}/static/og-image.png">
    
    <!-- Favicon -->
    <link rel="icon" type="image/x-icon" href="/static/favicon.ico">
    <link rel="apple-touch-icon" href="/static/apple-touch-icon.png">
    
    <!-- PWA Manifest -->
    <link rel="manifest" href="/static/manifest.json">
    <meta name="theme-color" content="#1e40af">
    
    <!-- Structured Data (JSON-LD) -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "SportsOrganization",
      "name": "とちスポLIFE - TOCHIGI SPORTS LIFE",
      "description": "栃木県の6つのプロスポーツチームを応援する総合スポーツ情報サイト",
      "url": "${siteUrl}",
      "logo": "${siteUrl}/static/logo.png",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "栃木県",
        "addressCountry": "JP"
      },
      "sameAs": [],
      "sport": ["バスケットボール", "サッカー", "アイスホッケー", "サイクルロードレース", "野球"]
    }
    </script>
    
    <!-- Stylesheets -->
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <link href="/static/style.css" rel="stylesheet">
</head>
<body class="bg-gray-50">
    <div id="app"></div>
    
    <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/dayjs@1.11.10/dayjs.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/dayjs@1.11.10/locale/ja.js"></script>
    <script src="/static/app.js?v=${Date.now()}"></script>
</body>
</html>`)
})

/**
 * GET /admin - 管理画面（CMS）
 */
app.get('/admin', async (c) => {
  return c.html(`<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>管理画面 - TOCHIGI SPORTS LIFE</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <style>
      .loading { border: 4px solid #f3f3f3; border-top: 4px solid #3498db; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; }
      @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    </style>
</head>
<body class="bg-gray-100">
    <div id="admin-app"></div>
    
    <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/dayjs@1.11.10/dayjs.min.js"></script>
    <script src="/static/admin.js?v=${Date.now()}"></script>
</body>
</html>`)
})

export default app

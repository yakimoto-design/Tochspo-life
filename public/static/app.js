// ==========================================
// Tochispo LIFE - Frontend Application
// ==========================================

// dayjs日本語ロケール設定
dayjs.locale('ja')

// ==========================================
// グローバル状態管理
// ==========================================
const AppState = {
  currentPage: 'home',
  teams: [],
  matches: [],
  players: [],
  featuredPlayers: [],
  guides: [],
  venues: [],
  localSpots: [],
  selectedVenue: null,
  stats: {}
}

// ==========================================
// ユーティリティ関数
// ==========================================

/**
 * スポーツタイプに応じたアイコンを返す
 */
function getSportIcon(sportType) {
  const icons = {
    'バスケットボール': 'fa-basketball-ball',
    'サッカー': 'fa-futbol',
    'アイスホッケー': 'fa-hockey-puck',
    'サイクルロードレース': 'fa-biking',
    '野球': 'fa-baseball-ball'
  }
  return icons[sportType] || 'fa-trophy'
}

/**
 * ページ遷移
 */
function navigateTo(page, pushState = true) {
  AppState.currentPage = page
  
  // Update browser URL
  if (pushState) {
    const url = page === 'home' ? '/' : `/${page}`
    window.history.pushState({ page }, '', url)
  }
  
  if (page === 'home') {
    renderMainPage()
  } else if (page === 'players') {
    renderPlayersPage()
  } else if (page.startsWith('players/')) {
    const playerId = page.replace('players/', '')
    renderPlayerDetailPage(playerId)
  } else if (page.startsWith('guides/')) {
    const slug = page.replace('guides/', '')
    renderGuideDetailPage(slug)
  } else if (page.startsWith('seo-page/')) {
    const slug = page.replace('seo-page/', '')
    renderSeoPage(slug)
  }
  // ページ遷移時はトップにスクロール
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

/**
 * セクションへスクロール（ヘッダー分のオフセットを考慮）
 */
function scrollToSection(sectionId) {
  const element = document.getElementById(sectionId)
  if (element) {
    // ヘッダーの高さ分のオフセット（約80px）を引く
    const headerOffset = 100
    const elementPosition = element.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    })
  }
}

// ==========================================
// データ取得関数
// ==========================================

/**
 * 全チームを取得
 */
async function fetchTeams() {
  try {
    const response = await axios.get('/api/teams')
    AppState.teams = response.data
  } catch (error) {
    console.error('チーム情報の取得に失敗しました:', error)
  }
}

/**
 * 今後の試合を取得
 */
async function fetchUpcomingMatches() {
  try {
    const response = await axios.get('/api/matches/upcoming?days=30')
    AppState.matches = response.data
  } catch (error) {
    console.error('試合情報の取得に失敗しました:', error)
  }
}

/**
 * 注目選手を取得
 */
async function fetchFeaturedPlayers() {
  try {
    const response = await axios.get('/api/players/featured')
    AppState.featuredPlayers = response.data
  } catch (error) {
    console.error('選手情報の取得に失敗しました:', error)
  }
}

/**
 * 観戦ガイドを取得
 */
async function fetchGuides() {
  try {
    const response = await axios.get('/api/guides')
    AppState.guides = response.data
  } catch (error) {
    console.error('観戦ガイドの取得に失敗しました:', error)
  }
}

/**
 * 会場一覧を取得
 */
async function fetchVenues() {
  try {
    const response = await axios.get('/api/venues')
    AppState.venues = response.data
  } catch (error) {
    console.error('会場情報の取得に失敗しました:', error)
  }
}

/**
 * 周辺スポットを取得
 */
async function fetchLocalSpots(venueId = null) {
  try {
    const url = venueId ? `/api/local-spots?venue_id=${venueId}` : '/api/local-spots'
    const response = await axios.get(url)
    return response.data
  } catch (error) {
    console.error('周辺スポット情報の取得に失敗しました:', error)
    return []
  }
}

/**
 * サイト統計を取得
 */
async function fetchStats() {
  try {
    const response = await axios.get('/api/stats')
    AppState.stats = response.data
  } catch (error) {
    console.error('統計情報の取得に失敗しました:', error)
  }
}

// ==========================================
// レンダリング関数
// ==========================================

/**
 * ヘッダーをレンダリング
 */
function renderHeader() {
  return `
    <header class="bg-black text-white shadow-2xl sticky top-0 z-50 border-b-2 border-yellow-500">
      <div class="container mx-auto px-4">
        <nav class="flex items-center justify-between py-5">
          <div class="site-logo cursor-pointer" onclick="navigateTo('home')">
            <div>
              <div class="flex items-center">
                <i class="fas fa-fire mr-3 text-3xl text-yellow-500"></i>
                <div>
                  <div class="text-3xl font-black tracking-wider" style="letter-spacing: 2px;">
                    TOCHISPO LIFE
                  </div>
                  <div class="text-xs text-yellow-400 mt-1 font-semibold tracking-wide" style="letter-spacing: 1px;">
                    栃木のプロスポーツをもっと身近に
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- デスクトップメニュー -->
          <div class="hidden md:flex space-x-8 text-white text-sm font-bold">
            <a href="#home" class="hover:text-yellow-400 transition duration-200" onclick="navigateTo('home')">
              <i class="fas fa-home mr-1"></i>ホーム
            </a>
            <a href="#schedule" class="hover:text-yellow-400 transition duration-200" onclick="scrollToSection('schedule')">
              <i class="fas fa-calendar mr-1"></i>試合情報
            </a>
            <a href="#teams" class="hover:text-yellow-400 transition duration-200" onclick="scrollToSection('teams')">
              <i class="fas fa-users mr-1"></i>チーム
            </a>
            <a href="#local-spots" class="hover:text-yellow-400 transition duration-200" onclick="scrollToSection('local-spots')">
              <i class="fas fa-map-marked-alt mr-1"></i>周辺情報
            </a>
            <a href="#guides" class="hover:text-yellow-400 transition duration-200" onclick="scrollToSection('guides')">
              <i class="fas fa-book mr-1"></i>コラム
            </a>
          </div>
          
          <!-- モバイルメニューボタン -->
          <button id="mobile-menu-button" class="md:hidden text-white focus:outline-none" onclick="toggleMobileMenu()">
            <i class="fas fa-bars text-2xl"></i>
          </button>
        </nav>
        
        <!-- モバイルメニュー -->
        <div id="mobile-menu" class="hidden md:hidden pb-4">
          <a href="#home" class="block py-2 px-4 hover:bg-gray-800 rounded transition" onclick="navigateTo('home'); toggleMobileMenu()">
            <i class="fas fa-home mr-2"></i>ホーム
          </a>
          <a href="#schedule" class="block py-2 px-4 hover:bg-gray-800 rounded transition" onclick="scrollToSection('schedule'); toggleMobileMenu()">
            <i class="fas fa-calendar mr-2"></i>試合情報
          </a>
          <a href="#teams" class="block py-2 px-4 hover:bg-gray-800 rounded transition" onclick="scrollToSection('teams'); toggleMobileMenu()">
            <i class="fas fa-users mr-2"></i>チーム
          </a>
          <a href="#players" class="block py-2 px-4 hover:bg-gray-800 rounded transition" onclick="scrollToSection('players'); toggleMobileMenu()">
            <i class="fas fa-star mr-2"></i>注目選手
          </a>
          <a href="#local-spots" class="block py-2 px-4 hover:bg-gray-800 rounded transition" onclick="scrollToSection('local-spots'); toggleMobileMenu()">
            <i class="fas fa-map-marked-alt mr-2"></i>周辺情報
          </a>
          <a href="#guides" class="block py-2 px-4 hover:bg-gray-800 rounded transition" onclick="scrollToSection('guides'); toggleMobileMenu()">
            <i class="fas fa-book mr-2"></i>コラム
          </a>
        </div>
      </div>
    </header>
  `
}

/**
 * モバイルメニュー切り替え
 */
function toggleMobileMenu() {
  const menu = document.getElementById('mobile-menu')
  const button = document.getElementById('mobile-menu-button')
  const icon = button.querySelector('i')
  
  if (menu.classList.contains('hidden')) {
    menu.classList.remove('hidden')
    icon.classList.remove('fa-bars')
    icon.classList.add('fa-times')
  } else {
    menu.classList.add('hidden')
    icon.classList.remove('fa-times')
    icon.classList.add('fa-bars')
  }
}

/**
 * ヒーローセクションをレンダリング
 */
function renderHero() {
  return `
    <section class="hero-section">
      <div id="hero-slider" class="relative w-full h-full">
        <!-- スライド1: 熱狂する観客 -->
        <div class="hero-slide active absolute inset-0 flex items-center justify-center text-center text-white transition-opacity duration-500" style="background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=1920&q=80'); background-size: cover; background-position: center;">
          <div class="container mx-auto px-4">
            <h1 class="text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg">
              <i class="fas fa-fire mr-3 text-yellow-400"></i>
              栃木のプロスポーツを応援しよう
            </h1>
            <p class="text-xl md:text-2xl mb-8 opacity-90 drop-shadow-lg">
              6つのプロスポーツチームがあなたを待っている
            </p>
            <button onclick="scrollToSection('schedule')" class="bg-yellow-500 hover:bg-orange-500 text-gray-900 font-bold py-4 px-10 rounded-full text-lg transition transform hover:scale-105 shadow-2xl">
              <i class="fas fa-calendar-alt mr-2"></i>今週末の試合を見る
            </button>
          </div>
        </div>
        
        <!-- スライド2: バスケットボールの熱戦 -->
        <div class="hero-slide absolute inset-0 flex items-center justify-center text-center text-white transition-opacity duration-500" style="background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1504450758481-7338eba7524a?auto=format&fit=crop&w=1920&q=80'); background-size: cover; background-position: center;">
          <div class="container mx-auto px-4">
            <h1 class="text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg">
              <i class="fas fa-users mr-3 text-green-400"></i>
              地元の選手を応援しよう
            </h1>
            <p class="text-xl md:text-2xl mb-8 opacity-90 drop-shadow-lg">
              栃木のヒーローは、すぐそこにいる
            </p>
            <button onclick="scrollToSection('players')" class="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-10 rounded-full text-lg transition transform hover:scale-105 shadow-2xl">
              <i class="fas fa-star mr-2"></i>注目選手を見る
            </button>
          </div>
        </div>
        
        <!-- スライド3: サッカーの歓喜の瞬間 -->
        <div class="hero-slide absolute inset-0 flex items-center justify-center text-center text-white transition-opacity duration-500" style="background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1920&q=80'); background-size: cover; background-position: center;">
          <div class="container mx-auto px-4">
            <h1 class="text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg">
              <i class="fas fa-book-open mr-3 text-yellow-400"></i>
              観戦がもっと楽しくなる
            </h1>
            <p class="text-xl md:text-2xl mb-8 opacity-90 drop-shadow-lg">
              5つのスポーツコラムで、あなたもファンに
            </p>
            <button onclick="scrollToSection('guides')" class="bg-yellow-500 hover:bg-orange-500 text-gray-900 font-bold py-4 px-10 rounded-full text-lg transition transform hover:scale-105 shadow-2xl">
              <i class="fas fa-book-open mr-2"></i>コラムを読む
            </button>
          </div>
        </div>
      </div>
    </section>
  `
}

/**
 * 統計セクションをレンダリング
 */
function renderStats(stats) {
  return `
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <!-- チーム数 -->
          <div class="bg-white rounded-xl shadow-lg p-6 text-center transform hover:scale-105 transition">
            <div class="text-5xl font-bold text-blue-600 mb-2">${stats.teams || 6}</div>
            <div class="text-gray-600 font-semibold">プロチーム</div>
            <div class="text-xs text-gray-500 mt-2">
              <i class="fas fa-shield-alt mr-1"></i>5競技
            </div>
          </div>
          
          <!-- 今後の試合数 -->
          <div class="bg-white rounded-xl shadow-lg p-6 text-center transform hover:scale-105 transition">
            <div class="text-5xl font-bold text-green-600 mb-2">${stats.upcoming_matches || 0}</div>
            <div class="text-gray-600 font-semibold">今後の試合</div>
            <div class="text-xs text-gray-500 mt-2">
              <i class="fas fa-calendar-alt mr-1"></i>ホームゲーム
            </div>
          </div>
          
          <!-- 選手数 -->
          <div class="bg-white rounded-xl shadow-lg p-6 text-center transform hover:scale-105 transition">
            <div class="text-5xl font-bold text-purple-600 mb-2">${stats.players || 0}</div>
            <div class="text-gray-600 font-semibold">注目選手</div>
            <div class="text-xs text-gray-500 mt-2">
              <i class="fas fa-star mr-1"></i>地元のヒーロー
            </div>
          </div>
          
          <!-- コラム数 -->
          <div class="bg-white rounded-xl shadow-lg p-6 text-center transform hover:scale-105 transition">
            <div class="text-5xl font-bold text-yellow-600 mb-2">${stats.guides || 0}</div>
            <div class="text-gray-600 font-semibold">コラム</div>
            <div class="text-xs text-gray-500 mt-2">
              <i class="fas fa-book mr-1"></i>観戦ガイド
            </div>
          </div>
        </div>
      </div>
    </section>
  `
}

/**
 * 直近の試合セクションをレンダリング（14日以内）
 */
function renderUpcomingMatches(matches) {
  // 14日以内の試合のみフィルタリング
  const now = dayjs()
  const twoWeeksLater = now.add(14, 'day')
  const filteredMatches = matches.filter(match => {
    const matchDate = dayjs(match.match_date)
    return matchDate.isAfter(now) && matchDate.isBefore(twoWeeksLater)
  })
  
  if (filteredMatches.length === 0) {
    return `
      <section id="schedule" class="py-16 bg-gray-50">
        <div class="container mx-auto px-4">
          <div class="section-header">
            <h2 class="text-3xl font-bold text-gray-800">
              <i class="fas fa-calendar-alt mr-2"></i>
              直近のホームゲーム
            </h2>
            <p class="text-gray-600 mt-2">現在予定されている試合はありません</p>
          </div>
        </div>
      </section>
    `
  }
  
  return `
    <section id="schedule" class="py-16 bg-gray-50">
      <div class="container mx-auto px-4">
        <div class="section-header">
          <h2 class="text-3xl font-bold text-gray-800">
            <i class="fas fa-calendar-alt mr-2"></i>
            直近のホームゲーム
          </h2>
          <p class="text-gray-600 mt-2">2週間以内に栃木で開催される試合</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          ${filteredMatches.slice(0, 6).map(match => `
            <div class="match-card">
              <!-- 日付 -->
              <div class="text-center mb-2">
                <span class="inline-block bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-bold">
                  <i class="fas fa-calendar mr-1"></i>
                  ${dayjs(match.match_date).format('M月D日(ddd)')}
                </span>
              </div>
              
              <!-- キックオフ時間 - 超特大で真ん中に表示 -->
              <div class="relative bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 mb-6 text-center shadow-xl transform hover:scale-105 transition-transform duration-300">
                <div class="absolute top-0 left-0 right-0 bottom-0 bg-white opacity-10 rounded-2xl"></div>
                <p class="relative text-sm text-white mb-2 font-bold uppercase tracking-widest opacity-90">⚽ KICK OFF</p>
                <p class="relative text-7xl font-black text-white drop-shadow-2xl" style="text-shadow: 0 4px 20px rgba(0,0,0,0.3);">${dayjs(match.match_date).format('HH:mm')}</p>
              </div>
              
              <!-- スポーツバッジ -->
              <div class="text-center mb-4">
                <span class="sport-badge inline-block" style="background-color: ${match.primary_color || '#3B82F6'}">
                  <i class="fas ${getSportIcon(match.sport_type)} mr-1"></i>
                  ${match.sport_type}
                </span>
              </div>
              
              <div class="mb-4">
                <h3 class="text-xl font-bold text-gray-800 mb-2">${match.team_name}</h3>
                <p class="text-gray-600">
                  <i class="fas fa-handshake mr-2"></i>
                  vs ${match.opponent_team}
                </p>
              </div>
              
              <div class="text-sm text-gray-600 mb-4">
                <i class="fas fa-map-marker-alt mr-2"></i>
                ${match.venue_name || '会場未定'}
              </div>
              
              ${match.ticket_url ? `
                <a href="${match.ticket_url}" target="_blank" rel="noopener" class="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 text-center block shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                  <i class="fas fa-ticket-alt mr-2"></i>チケット購入
                </a>
              ` : `
                <div class="w-full bg-gray-300 text-gray-500 font-bold py-3 px-6 rounded-lg text-center cursor-not-allowed">
                  <i class="fas fa-ticket-alt mr-2"></i>チケット情報準備中
                </div>
              `}
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `
}

/**
 * 注目選手セクションをレンダリング
 */
function renderFeaturedPlayers(players) {
  console.log('renderFeaturedPlayers called with:', players ? players.length : 0, 'players')
  if (!players || players.length === 0) {
    console.warn('No featured players to display')
    return ''
  }
  
  return `
    <section id="players" class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <div class="section-header">
          <h2 class="text-3xl font-bold text-gray-800">
            <i class="fas fa-star mr-2 text-yellow-500"></i>
            注目選手
          </h2>
          <p class="text-gray-600 mt-2">栃木のトップアスリートたち</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          ${players.slice(0, 12).map(player => `
            <div class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer" onclick="showPlayerDetail(${player.id})">
              <div class="player-card-image">
                ${player.photo_url ? `
                  <img src="${player.photo_url}" alt="${player.name}">
                ` : `
                  <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);" class="text-white text-6xl">
                    <i class="fas fa-user-circle"></i>
                  </div>
                `}
                <div class="absolute top-2 right-2 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold" style="z-index: 10;">
                  <i class="fas fa-star mr-1"></i>注目
                </div>
              </div>
              
              <div class="p-4">
                <div class="flex items-center justify-between mb-2">
                  <h3 class="text-lg font-bold text-gray-800">${player.name}</h3>
                  ${player.uniform_number ? `
                    <span class="text-2xl font-bold text-blue-600">#${player.uniform_number}</span>
                  ` : ''}
                </div>
                
                <p class="text-sm text-gray-600 mb-2">
                  <i class="fas ${getSportIcon(player.sport_type)} mr-1"></i>
                  ${player.team_name}
                </p>
                
                ${player.position ? `
                  <p class="text-sm text-gray-600 mb-3">
                    <i class="fas fa-running mr-1"></i>
                    ${player.position}
                  </p>
                ` : ''}
                
                <div class="flex items-center gap-3 text-xs text-gray-500">
                  ${player.height ? `
                    <span><i class="fas fa-arrows-alt-v mr-1"></i>${player.height}cm</span>
                  ` : ''}
                  ${player.weight ? `
                    <span><i class="fas fa-weight mr-1"></i>${player.weight}kg</span>
                  ` : ''}
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `
}

/**
 * チーム一覧セクションをレンダリング
 */
function renderTeams(teams) {
  return `
    <section id="teams" class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <div class="section-header">
          <h2 class="text-3xl font-bold text-gray-800">
            <i class="fas fa-shield-alt mr-2"></i>
            栃木の6つのプロスポーツチーム
          </h2>
          <p class="text-gray-600 mt-2">地元で活躍するプロチーム</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          ${teams.map(team => `
            <div class="team-card">
              <div class="flex items-center mb-4">
                <div class="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mr-4">
                  <i class="fas ${getSportIcon(team.sport_type)} text-3xl text-blue-600"></i>
                </div>
                <div>
                  <h3 class="text-xl font-bold text-gray-800">${team.name}</h3>
                  <p class="text-sm text-gray-600">${team.sport_type}</p>
                  <p class="text-xs text-gray-500">${team.league || ''}</p>
                </div>
              </div>
              
              ${team.description ? `
                <p class="text-gray-600 text-sm mb-4">${team.description.substring(0, 80)}...</p>
              ` : ''}
              
              ${team.website_url ? `
                <a href="${team.website_url}" target="_blank" rel="noopener" class="text-blue-600 hover:text-blue-800 text-sm font-semibold">
                  公式サイトへ <i class="fas fa-external-link-alt ml-1"></i>
                </a>
              ` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `
}

/**
 * 観戦ガイドセクションをレンダリング
 */
/**
 * 家族向けガイドセクションをレンダリング
 */
function renderFamilyGuides() {
  return `
    <section class="py-16 bg-gradient-to-br from-blue-50 to-purple-50">
      <div class="container mx-auto px-4">
        <div class="section-header text-center">
          <h2 class="text-4xl font-bold text-gray-800 mb-3">
            <i class="fas fa-users mr-3 text-blue-600"></i>
            家族で楽しむスポーツ観戦
          </h2>
          <p class="text-gray-600 text-lg">初めての方でも安心！家族向けの完全ガイド</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <!-- 家族向け観戦ガイド -->
          <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition cursor-pointer transform hover:-translate-y-2" onclick="navigateTo('seo-page/family-guide')">
            <div class="bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-center">
              <i class="fas fa-users text-7xl text-white mb-4"></i>
              <h3 class="text-2xl font-bold text-white">家族向け<br>観戦ガイド</h3>
            </div>
            <div class="p-6">
              <p class="text-gray-600 mb-4">
                子供連れでも安心！持ち物、座席選び、会場サービスなど、初めての方向けの完全ガイド
              </p>
              <ul class="text-sm text-gray-600 space-y-2 mb-4">
                <li><i class="fas fa-check-circle text-green-600 mr-2"></i>おすすめ座席</li>
                <li><i class="fas fa-check-circle text-green-600 mr-2"></i>持ち物チェックリスト</li>
                <li><i class="fas fa-check-circle text-green-600 mr-2"></i>授乳室・キッズスペース</li>
              </ul>
              <div class="text-blue-600 font-bold text-center">
                詳しく見る <i class="fas fa-arrow-right ml-2"></i>
              </div>
            </div>
          </div>
          
          <!-- お出かけスポット -->
          <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition cursor-pointer transform hover:-translate-y-2" onclick="navigateTo('seo-page/outing-spots')">
            <div class="bg-gradient-to-r from-green-600 to-green-700 p-8 text-center">
              <i class="fas fa-map-marked-alt text-7xl text-white mb-4"></i>
              <h3 class="text-2xl font-bold text-white">お出かけ<br>スポット</h3>
            </div>
            <div class="p-6">
              <p class="text-gray-600 mb-4">
                試合前後に立ち寄れる！栃木の観光スポット、グルメ、遊び場をご紹介
              </p>
              <ul class="text-sm text-gray-600 space-y-2 mb-4">
                <li><i class="fas fa-check-circle text-green-600 mr-2"></i>宇都宮餃子めぐり</li>
                <li><i class="fas fa-check-circle text-green-600 mr-2"></i>日光観光コース</li>
                <li><i class="fas fa-check-circle text-green-600 mr-2"></i>モデルコース紹介</li>
              </ul>
              <div class="text-green-600 font-bold text-center">
                詳しく見る <i class="fas fa-arrow-right ml-2"></i>
              </div>
            </div>
          </div>
          
          <!-- よくある質問 -->
          <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition cursor-pointer transform hover:-translate-y-2" onclick="navigateTo('seo-page/faq')">
            <div class="bg-gradient-to-r from-purple-600 to-purple-700 p-8 text-center">
              <i class="fas fa-question-circle text-7xl text-white mb-4"></i>
              <h3 class="text-2xl font-bold text-white">よくある<br>質問</h3>
            </div>
            <div class="p-6">
              <p class="text-gray-600 mb-4">
                スポーツ観戦が初めての方へ。チケット、服装、マナーなど疑問を解決
              </p>
              <ul class="text-sm text-gray-600 space-y-2 mb-4">
                <li><i class="fas fa-check-circle text-green-600 mr-2"></i>チケットの買い方</li>
                <li><i class="fas fa-check-circle text-green-600 mr-2"></i>服装・持ち物</li>
                <li><i class="fas fa-check-circle text-green-600 mr-2"></i>観戦マナー</li>
              </ul>
              <div class="text-purple-600 font-bold text-center">
                詳しく見る <i class="fas fa-arrow-right ml-2"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `
}

function renderGuides(guides) {
  if (guides.length === 0) {
    return ''
  }
  
  return `
    <section id="guides" class="py-16 bg-gray-50">
      <div class="container mx-auto px-4">
        <div class="section-header">
          <h2 class="text-3xl font-bold text-gray-800">
            <i class="fas fa-book-open mr-2"></i>
            観戦が楽しくなるコラム
          </h2>
          <p class="text-gray-600 mt-2">スポーツをもっと楽しむための読み物</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          ${guides.map(guide => `
            <div class="guide-card p-6 cursor-pointer" onclick="showGuideDetail('${guide.slug}')">
              <div class="flex items-center mb-4">
                <div class="w-16 h-16 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center mr-4">
                  <i class="fas ${guide.icon || getSportIcon(guide.sport_type)} text-3xl text-orange-600"></i>
                </div>
                <div class="flex-1">
                  <h3 class="text-xl font-bold text-gray-800 mb-1">${guide.title}</h3>
                  <span class="text-xs text-gray-500">${guide.sport_type}</span>
                </div>
              </div>
              <p class="text-gray-600 text-sm mb-4">
                ${guide.description ? guide.description.substring(0, 100) : guide.content.substring(0, 100)}...
              </p>
              <div class="text-blue-600 hover:text-blue-800 font-semibold text-sm">
                詳しく見る <i class="fas fa-arrow-right ml-1"></i>
              </div>
            </div>
          `).join('')}
        </div>
        
        <!-- もっと見るボタン -->
        <div class="text-center mt-12">
          <button onclick="showAllGuides()" class="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold py-4 px-12 rounded-lg text-lg transition shadow-lg">
            <i class="fas fa-book-open mr-2"></i>もっと見る - 全コラム一覧
          </button>
        </div>
      </div>
    </section>
  `
}

/**
 * 周辺情報セクションをレンダリング
 */
function renderLocalSpots() {
  return `
    <section id="local-spots" class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <div class="section-header">
          <h2 class="text-3xl font-bold text-gray-800">
            <i class="fas fa-map-marked-alt mr-2"></i>
            会場周辺情報
          </h2>
          <p class="text-gray-600 mt-2">試合会場周辺のグルメ・観光スポット</p>
        </div>
        
        <!-- 会場選択ドロップダウン -->
        <div class="mb-8 text-center">
          <div class="inline-block">
            <label class="block text-sm font-bold text-gray-700 mb-2">
              <i class="fas fa-map-marker-alt mr-1"></i>会場を選択
            </label>
            <select id="venue-selector" onchange="loadLocalSpots(this.value)" class="px-6 py-3 border-2 border-gray-300 rounded-lg text-lg font-semibold focus:outline-none focus:border-blue-500 transition">
              <option value="">すべての会場</option>
            </select>
          </div>
        </div>
        
        <!-- 周辺スポット表示エリア -->
        <div id="local-spots-container" class="flex justify-center items-center py-20">
          <div class="loading"></div>
        </div>
      </div>
    </section>
  `
}

/**
 * 周辺スポットを読み込んで表示
 */
async function loadLocalSpots(venueId) {
  const container = document.getElementById('local-spots-container')
  if (!container) return
  
  container.innerHTML = '<div class="flex justify-center items-center py-20"><div class="loading"></div></div>'
  
  try {
    const spots = await fetchLocalSpots(venueId || null)
    
    if (!spots || spots.length === 0) {
      container.innerHTML = `
        <div class="text-center py-12">
          <i class="fas fa-map-marked-alt text-6xl text-gray-300 mb-4"></i>
          <p class="text-gray-600 text-lg">周辺スポット情報がまだ登録されていません</p>
        </div>
      `
      return
    }
    
    // カテゴリごとに分類
    const categories = {
      'グルメ': [],
      '観光': [],
      'ショッピング': [],
      '宿泊': [],
      'その他': []
    }
    
    spots.forEach(spot => {
      const category = spot.category || 'その他'
      if (!categories[category]) {
        categories[category] = []
      }
      categories[category].push(spot)
    })
    
    // カテゴリごとに表示
    const html = Object.keys(categories)
      .filter(cat => categories[cat].length > 0)
      .map(category => {
        const categoryIcons = {
          'グルメ': 'fa-utensils',
          '観光': 'fa-camera',
          'ショッピング': 'fa-shopping-bag',
          '宿泊': 'fa-hotel',
          'その他': 'fa-star'
        }
        
        return `
          <div class="mb-10">
            <h3 class="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <i class="fas ${categoryIcons[category] || 'fa-star'} text-blue-600 mr-3"></i>
              ${category}
              <span class="ml-3 bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
                ${categories[category].length}件
              </span>
            </h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              ${categories[category].map(spot => `
                <div class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
                  ${spot.image_url ? `
                    <div class="h-48 overflow-hidden">
                      <img src="${spot.image_url}" alt="${spot.name}" class="w-full h-full object-cover hover:scale-110 transition-transform duration-300">
                    </div>
                  ` : `
                    <div class="h-48 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                      <i class="fas ${categoryIcons[category] || 'fa-star'} text-6xl text-white opacity-50"></i>
                    </div>
                  `}
                  
                  <div class="p-6">
                    <h4 class="text-xl font-bold text-gray-800 mb-2">${spot.name}</h4>
                    
                    ${spot.venue_name ? `
                      <p class="text-sm text-gray-500 mb-2">
                        <i class="fas fa-map-marker-alt mr-1"></i>
                        ${spot.venue_name}から
                        ${spot.walking_time ? `徒歩${spot.walking_time}分` : ''}
                      </p>
                    ` : ''}
                    
                    ${spot.address ? `
                      <p class="text-sm text-gray-600 mb-3">
                        <i class="fas fa-location-dot mr-1"></i>
                        ${spot.address}
                      </p>
                    ` : ''}
                    
                    ${spot.description ? `
                      <p class="text-sm text-gray-700 mb-4 line-clamp-3">${spot.description}</p>
                    ` : ''}
                    
                    ${spot.website_url ? `
                      <a href="${spot.website_url}" target="_blank" rel="noopener" class="inline-block text-blue-600 hover:text-blue-800 text-sm font-semibold">
                        <i class="fas fa-external-link-alt mr-1"></i>詳しく見る
                      </a>
                    ` : ''}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        `
      }).join('')
    
    container.innerHTML = html
    
  } catch (error) {
    console.error('周辺スポットの表示に失敗しました:', error)
    container.innerHTML = `
      <div class="text-center py-12">
        <i class="fas fa-exclamation-circle text-6xl text-red-300 mb-4"></i>
        <p class="text-gray-600 text-lg">データの取得に失敗しました</p>
      </div>
    `
  }
}

/**
 * フッターをレンダリング
 */
function renderFooter() {
  return `
    <footer class="site-footer">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 class="text-white font-bold mb-4">Tochispo LIFE</h3>
            <p class="text-sm">
              栃木のプロスポーツをもっと身近に。<br>
              栃木県の6つのプロスポーツチームを応援する総合スポーツ情報サイト。
            </p>
          </div>
          <div>
            <h3 class="text-white font-bold mb-4">対象チーム</h3>
            <ul class="text-sm space-y-1">
              <li>宇都宮ブレックス（バスケットボール）</li>
              <li>栃木SC（サッカー）</li>
              <li>H.C.栃木日光アイスバックス（アイスホッケー）</li>
              <li>宇都宮ブリッツェン（サイクルロードレース）</li>
              <li>栃木ゴールデンブレーブス（野球）</li>
              <li>栃木シティフットボールクラブ（サッカー）</li>
            </ul>
          </div>
          <div>
            <h3 class="text-white font-bold mb-4">リンク</h3>
            <ul class="text-sm space-y-2">
              <li><a href="#home" onclick="navigateTo('home')"><i class="fas fa-home mr-2"></i>ホーム</a></li>
              <li><a href="#schedule" onclick="scrollToSection('schedule')"><i class="fas fa-calendar mr-2"></i>今週末の試合</a></li>
              <li><a href="#teams" onclick="scrollToSection('teams')"><i class="fas fa-users mr-2"></i>チーム一覧</a></li>
              <li><a href="#guides" onclick="scrollToSection('guides')"><i class="fas fa-book mr-2"></i>コラム</a></li>
            </ul>
            <h3 class="text-white font-bold mb-4 mt-6">家族向けガイド</h3>
            <ul class="text-sm space-y-2">
              <li><a href="javascript:void(0)" onclick="navigateTo('seo-page/family-guide')"><i class="fas fa-users mr-2"></i>家族向け観戦ガイド</a></li>
              <li><a href="javascript:void(0)" onclick="navigateTo('seo-page/outing-spots')"><i class="fas fa-map-marked-alt mr-2"></i>お出かけスポット</a></li>
              <li><a href="javascript:void(0)" onclick="navigateTo('seo-page/faq')"><i class="fas fa-question-circle mr-2"></i>よくある質問</a></li>
            </ul>
          </div>
        </div>
        <div class="border-t border-gray-700 pt-6 text-center text-sm">
          <p>&copy; 2025 Tochispo LIFE. All rights reserved.</p>
        </div>
      </div>
    </footer>
  `
}

/**
 * メインページをレンダリング
 */
async function renderMainPage() {
  const app = document.getElementById('app')
  
  // ローディング表示
  app.innerHTML = renderHeader() + '<div class="container mx-auto px-4 py-12"><div class="text-center"><div class="loading mx-auto"></div><p class="mt-4 text-gray-600">読み込み中...</p></div></div>'
  
  // データ取得
  await Promise.all([
    fetchTeams(),
    fetchUpcomingMatches(),
    fetchFeaturedPlayers(),
    fetchGuides(),
    fetchVenues(),
    fetchStats()
  ])
  
  // ページレンダリング
  app.innerHTML = 
    renderHeader() +
    renderHero() +
    renderStats(AppState.stats) +
    renderUpcomingMatches(AppState.matches) +
    renderFeaturedPlayers(AppState.featuredPlayers) +
    renderFamilyGuides() +
    renderTeams(AppState.teams) +
    renderGuides(AppState.guides) +
    renderLocalSpots() +
    renderFooter()
  
  // ヒーロースライダー初期化
  initHeroSlider()
  
  // 会場セレクターの初期化
  initVenueSelector()
  
  // 周辺スポットの初期読み込み
  loadLocalSpots()
}

/**
 * 会場セレクターを初期化
 */
function initVenueSelector() {
  const selector = document.getElementById('venue-selector')
  if (!selector || !AppState.venues) return
  
  // 既存のオプションをクリア（「すべての会場」以外）
  while (selector.options.length > 1) {
    selector.remove(1)
  }
  
  // 会場オプションを追加
  AppState.venues.forEach(venue => {
    const option = document.createElement('option')
    option.value = venue.id
    option.textContent = venue.name
    selector.appendChild(option)
  })
}

/**
 * ヒーロースライダーを初期化
 */
function initHeroSlider() {
  let currentSlide = 0
  const slides = document.querySelectorAll('.hero-slide')
  
  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.remove('active')
      if (i === index) {
        slide.classList.add('active')
      }
    })
  }
  
  setInterval(() => {
    currentSlide = (currentSlide + 1) % slides.length
    showSlide(currentSlide)
  }, 5000)
}

/**
 * 記事詳細ページを表示
 */
async function renderGuideDetailPage(slug) {
  const app = document.getElementById('app')
  
  // ローディング表示
  app.innerHTML = renderHeader() + '<div class="container mx-auto px-4 py-12"><div class="text-center"><div class="loading mx-auto"></div><p class="mt-4 text-gray-600">読み込み中...</p></div></div>'
  
  try {
    const response = await axios.get(`/api/guides/${slug}`)
    const guide = response.data
    
    // HTMLコンテンツをそのまま使用（管理画面で入力済み）
    let contentHtml = guide.content
    
    // もしMarkdown形式の場合は変換
    if (!contentHtml.includes('<')) {
      contentHtml = guide.content
        .replace(/^# (.+)$/gm, '<h1 class="text-3xl font-bold mb-4 mt-8 text-gray-800">$1</h1>')
        .replace(/^## (.+)$/gm, '<h2 class="text-2xl font-bold mb-3 mt-6 text-gray-800">$1</h2>')
        .replace(/^### (.+)$/gm, '<h3 class="text-xl font-bold mb-2 mt-4 text-gray-700">$1</h3>')
        .replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold text-gray-900">$1</strong>')
        .replace(/\n\n/g, '</p><p class="mb-4 text-gray-700 leading-relaxed">')
      
      // リストアイテムを<ul>タグで囲む
      contentHtml = contentHtml.replace(/((?:^- .+$\n?)+)/gm, '<ul class="list-disc list-inside mb-4 ml-4 space-y-2">$1</ul>')
      contentHtml = contentHtml.replace(/^- (.+)$/gm, '<li class="text-gray-700">$1</li>')
    }
    
    app.innerHTML = renderHeader() + `
      <div class="bg-gray-50 min-h-screen">
        <div class="container mx-auto px-4 py-8">
          <button onclick="showAllGuides()" class="mb-4 text-gray-600 hover:text-gray-800">
            <i class="fas fa-arrow-left mr-2"></i>記事一覧に戻る
          </button>
          
          <div class="bg-white rounded-lg shadow-lg overflow-hidden">
            <div class="bg-gradient-to-r from-green-700 to-yellow-600 text-white p-8">
              <div class="text-6xl mb-4">
                <i class="fas ${guide.icon || getSportIcon(guide.sport_type)} text-yellow-400"></i>
              </div>
              <h1 class="text-4xl font-bold mb-2">${guide.title}</h1>
              ${guide.description ? `<p class="text-xl opacity-90">${guide.description}</p>` : `<p class="text-xl opacity-90">${guide.sport_type}の観戦を楽しもう！</p>`}
            </div>
            
            ${guide.image_url ? `
              <img src="${guide.image_url}" alt="${guide.title}" class="w-full h-64 object-cover">
            ` : ''}
            
            <div class="p-8">
              <div class="prose prose-lg max-w-none">
                ${contentHtml}
              </div>
              
              <div class="mt-12 p-6 bg-blue-50 rounded-lg">
                <h3 class="text-xl font-bold text-gray-800 mb-3">
                  <i class="fas fa-bullhorn mr-2 text-blue-600"></i>
                  さあ、試合を観に行こう！
                </h3>
                <p class="text-gray-700 mb-4">
                  このガイドを参考に、${guide.sport_type}の試合を観戦してみましょう。<br>
                  初めての方でも、きっと楽しめます！
                </p>
                <button onclick="navigateTo('home')" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition">
                  <i class="fas fa-home mr-2"></i>トップページに戻る
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    ` + renderFooter()
    
  } catch (error) {
    console.error('ガイド情報の読み込みに失敗しました:', error)
    app.innerHTML = renderHeader() + `
      <div class="container mx-auto px-4 py-12 text-center">
        <i class="fas fa-exclamation-triangle text-6xl text-red-500 mb-4"></i>
        <h2 class="text-2xl font-bold text-gray-800 mb-4">エラーが発生しました</h2>
        <p class="text-gray-600 mb-6">ガイド情報の読み込みに失敗しました。</p>
        <button onclick="navigateTo('home')" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg">
          <i class="fas fa-home mr-2"></i>トップページに戻る
        </button>
      </div>
    ` + renderFooter()
  }
}

/**
 * SEOページをレンダリング
 */
async function renderSeoPage(slug) {
  const app = document.getElementById('app')
  
  // ローディング表示
  app.innerHTML = renderHeader() + '<div class="container mx-auto px-4 py-12"><div class="text-center"><div class="loading mx-auto"></div><p class="mt-4 text-gray-600">読み込み中...</p></div></div>'
  
  try {
    const response = await axios.get(`/api/seo-pages/${slug}`)
    const page = response.data
    
    // Markdown形式のコンテンツをHTMLに変換
    let contentHtml = page.content
      .replace(/^# (.+)$/gm, '<h1 class="text-4xl font-bold mb-6 mt-8 text-gray-900">$1</h1>')
      .replace(/^## (.+)$/gm, '<h2 class="text-3xl font-bold mb-4 mt-8 text-gray-800 border-b-2 border-blue-600 pb-2">$1</h2>')
      .replace(/^### (.+)$/gm, '<h3 class="text-2xl font-bold mb-3 mt-6 text-gray-700">$1</h3>')
      .replace(/^#### (.+)$/gm, '<h4 class="text-xl font-bold mb-2 mt-4 text-gray-700">$1</h4>')
      .replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold text-gray-900">$1</strong>')
      .replace(/\n\n/g, '</p><p class="mb-4 text-gray-700 leading-relaxed text-lg">')
    
    // チェックリストアイテム（✅付き）
    contentHtml = contentHtml.replace(/^✅ \*\*(.+?)\*\*$/gm, '<li class="flex items-start mb-2"><span class="text-green-600 mr-2 text-xl">✅</span><span class="font-bold text-gray-900">$1</span></li>')
    contentHtml = contentHtml.replace(/^✅ (.+)$/gm, '<li class="flex items-start mb-2"><span class="text-green-600 mr-2 text-xl">✅</span><span class="text-gray-700">$1</span></li>')
    
    // 通常のリストアイテム
    contentHtml = contentHtml.replace(/((?:^- .+$\n?)+)/gm, '<ul class="list-disc list-inside mb-6 ml-4 space-y-2">$1</ul>')
    contentHtml = contentHtml.replace(/^- (.+)$/gm, '<li class="text-gray-700">$1</li>')
    
    // コードブロック
    contentHtml = contentHtml.replace(/```([\\s\\S]+?)```/g, '<pre class="bg-gray-100 p-4 rounded-lg mb-4 overflow-x-auto"><code>$1</code></pre>')
    
    // 段落の開始
    if (!contentHtml.startsWith('<')) {
      contentHtml = '<p class="mb-4 text-gray-700 leading-relaxed text-lg">' + contentHtml
    }
    if (!contentHtml.endsWith('</p>')) {
      contentHtml += '</p>'
    }
    
    // アイコンマッピング
    const iconMap = {
      'family-guide': 'fa-users',
      'outing-spots': 'fa-map-marked-alt',
      'faq': 'fa-question-circle'
    }
    const icon = iconMap[slug] || 'fa-file-alt'
    
    app.innerHTML = renderHeader() + `
      <div class="bg-gray-50 min-h-screen">
        <div class="container mx-auto px-4 py-8">
          <button onclick="navigateTo('home')" class="mb-6 text-gray-600 hover:text-gray-800 transition">
            <i class="fas fa-arrow-left mr-2"></i>トップページに戻る
          </button>
          
          <div class="bg-white rounded-lg shadow-xl overflow-hidden">
            <div class="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-12 text-center">
              <div class="text-7xl mb-6">
                <i class="fas ${icon} text-yellow-300"></i>
              </div>
              <h1 class="text-5xl font-bold mb-4">${page.title}</h1>
              <p class="text-xl opacity-90 max-w-3xl mx-auto">${page.meta_description}</p>
            </div>
            
            ${page.featured_image_url ? `
              <img src="${page.featured_image_url}" alt="${page.title}" class="w-full h-96 object-cover">
            ` : ''}
            
            <div class="p-12">
              <div class="prose prose-lg max-w-none">
                ${contentHtml}
              </div>
              
              <div class="mt-16 grid md:grid-cols-2 gap-6">
                <div class="p-6 bg-blue-50 rounded-lg">
                  <h3 class="text-2xl font-bold text-gray-800 mb-4">
                    <i class="fas fa-calendar-check mr-2 text-blue-600"></i>
                    試合スケジュールをチェック
                  </h3>
                  <p class="text-gray-700 mb-4">
                    今月の試合スケジュールを確認して、家族で観戦に行きましょう！
                  </p>
                  <button onclick="navigateTo('home')" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition w-full">
                    <i class="fas fa-home mr-2"></i>試合一覧を見る
                  </button>
                </div>
                
                <div class="p-6 bg-green-50 rounded-lg">
                  <h3 class="text-2xl font-bold text-gray-800 mb-4">
                    <i class="fas fa-users mr-2 text-green-600"></i>
                    注目選手をチェック
                  </h3>
                  <p class="text-gray-700 mb-4">
                    栃木のプロスポーツ選手をもっと知って、応援しましょう！
                  </p>
                  <button onclick="navigateTo('players')" class="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition w-full">
                    <i class="fas fa-star mr-2"></i>選手一覧を見る
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ` + renderFooter()
    
  } catch (error) {
    console.error('ページ情報の読み込みに失敗しました:', error)
    app.innerHTML = renderHeader() + `
      <div class="container mx-auto px-4 py-12 text-center">
        <i class="fas fa-exclamation-triangle text-6xl text-red-500 mb-4"></i>
        <h2 class="text-2xl font-bold text-gray-800 mb-4">エラーが発生しました</h2>
        <p class="text-gray-600 mb-6">ページ情報の読み込みに失敗しました。</p>
        <button onclick="navigateTo('home')" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg">
          <i class="fas fa-home mr-2"></i>トップページに戻る
        </button>
      </div>
    ` + renderFooter()
  }
}

/**
 * 記事一覧ページをレンダリング
 */
async function renderGuidesList() {
  const app = document.getElementById('app')
  
  // ローディング表示
  app.innerHTML = renderHeader() + '<div class="container mx-auto px-4 py-12"><div class="text-center"><div class="loading mx-auto"></div><p class="mt-4 text-gray-600">読み込み中...</p></div></div>'
  
  try {
    const response = await axios.get('/api/guides')
    const guides = response.data
    
    // スポーツ種目でグループ化
    const groupedGuides = {}
    guides.forEach(guide => {
      if (!groupedGuides[guide.sport_type]) {
        groupedGuides[guide.sport_type] = []
      }
      groupedGuides[guide.sport_type].push(guide)
    })
    
    app.innerHTML = renderHeader() + `
      <div class="bg-gray-50 min-h-screen">
        <div class="container mx-auto px-4 py-8">
          <button onclick="navigateTo('home')" class="mb-4 text-gray-600 hover:text-gray-800">
            <i class="fas fa-arrow-left mr-2"></i>トップページに戻る
          </button>
          
          <div class="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
            <div class="bg-gradient-to-r from-orange-600 to-red-600 text-white p-8">
              <h1 class="text-4xl font-bold mb-2">
                <i class="fas fa-book-open mr-3"></i>観戦が楽しくなるコラム
              </h1>
              <p class="text-xl opacity-90">スポーツをもっと楽しむための読み物集</p>
            </div>
          </div>
          
          ${Object.keys(groupedGuides).length > 0 ? Object.keys(groupedGuides).map(sportType => `
            <div class="mb-12">
              <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <i class="fas ${getSportIcon(sportType)} text-blue-600 mr-3"></i>
                ${sportType}
              </h2>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                ${groupedGuides[sportType].map(guide => `
                  <div class="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer" onclick="showGuideDetail('${guide.slug}')">
                    <div class="p-6">
                      <div class="flex items-center mb-4">
                        <div class="w-16 h-16 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center mr-4">
                          <i class="fas ${guide.icon || getSportIcon(guide.sport_type)} text-3xl text-orange-600"></i>
                        </div>
                        <div class="flex-1">
                          <h3 class="text-xl font-bold text-gray-800 mb-1">${guide.title}</h3>
                          <span class="text-xs text-gray-500">${guide.sport_type}</span>
                        </div>
                      </div>
                      
                      ${guide.description ? `
                        <p class="text-gray-600 text-sm mb-4 line-clamp-3">${guide.description}</p>
                      ` : `
                        <p class="text-gray-600 text-sm mb-4 line-clamp-3">${guide.content.substring(0, 100)}...</p>
                      `}
                      
                      <div class="flex items-center text-blue-600 hover:text-blue-800 font-semibold text-sm">
                        <span>詳しく見る</span>
                        <i class="fas fa-arrow-right ml-2"></i>
                      </div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('') : `
            <div class="bg-white rounded-lg shadow-md p-12 text-center">
              <i class="fas fa-book text-6xl text-gray-300 mb-4"></i>
              <p class="text-gray-600 text-lg">まだ記事がありません</p>
            </div>
          `}
        </div>
      </div>
    ` + renderFooter()
    
  } catch (error) {
    console.error('ガイド一覧の取得に失敗しました:', error)
    app.innerHTML = renderHeader() + `
      <div class="container mx-auto px-4 py-12 text-center">
        <i class="fas fa-exclamation-triangle text-6xl text-red-500 mb-4"></i>
        <h2 class="text-2xl font-bold text-gray-800 mb-4">エラーが発生しました</h2>
        <p class="text-gray-600 mb-6">ガイド一覧の読み込みに失敗しました。</p>
        <button onclick="navigateTo('home')" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg">
          <i class="fas fa-home mr-2"></i>トップページに戻る
        </button>
      </div>
    ` + renderFooter()
  }
}

/**
 * 記事詳細ページを表示
 */
function showGuideDetail(slug) {
  window.scrollTo(0, 0)
  navigateTo(`guides/${slug}`)
}

/**
 * 記事一覧ページを表示
 */
function showAllGuides() {
  window.scrollTo(0, 0)
  renderGuidesList()
}

/**
 * 選手詳細ページへ遷移
 */
function showPlayerDetail(playerId) {
  window.scrollTo(0, 0)
  navigateTo(`players/${playerId}`)
}

/**
 * 注目選手一覧ページをレンダリング
 */
async function renderPlayersPage() {
  const app = document.getElementById('app')
  app.innerHTML = renderHeader() + `
    <div class="bg-gray-50 min-h-screen">
      <div class="container mx-auto px-4 py-8">
        <button onclick="navigateTo('home')" class="mb-6 text-gray-600 hover:text-gray-800 transition">
          <i class="fas fa-arrow-left mr-2"></i>トップページに戻る
        </button>
        
        <div class="text-center mb-8">
          <h1 class="text-4xl font-bold text-gray-800 mb-3">
            <i class="fas fa-star text-yellow-500 mr-3"></i>注目選手一覧
          </h1>
          <p class="text-lg text-gray-600">栃木のトップアスリート全員をご紹介</p>
        </div>
        
        <div id="players-list" class="flex justify-center items-center py-20">
          <div class="loading"></div>
        </div>
      </div>
    </div>
  ` + renderFooter()
  
  // 全選手データを取得
  try {
    const response = await axios.get('/api/players')
    const players = response.data
    
    if (!players || players.length === 0) {
      document.getElementById('players-list').innerHTML = `
        <div class="text-center py-12">
          <i class="fas fa-user-slash text-6xl text-gray-300 mb-4"></i>
          <p class="text-gray-600 text-lg">注目選手が登録されていません</p>
        </div>
      `
      return
    }
    
    // チームごとに選手を分類
    const playersByTeam = {}
    players.forEach(player => {
      if (!playersByTeam[player.team_name]) {
        playersByTeam[player.team_name] = {
          sport_type: player.sport_type,
          players: []
        }
      }
      playersByTeam[player.team_name].players.push(player)
    })
    
    // チームごとに選手を表示
    const html = Object.keys(playersByTeam)
      .sort()
      .map(teamName => {
        const teamData = playersByTeam[teamName]
        const players = teamData.players.sort((a, b) => {
          const numA = parseInt(a.uniform_number) || 999
          const numB = parseInt(b.uniform_number) || 999
          return numA - numB
        })
        
        return `
          <div class="mb-12">
            <div class="flex items-center mb-6">
              <i class="fas ${getSportIcon(teamData.sport_type)} text-3xl text-blue-600 mr-3"></i>
              <h2 class="text-2xl font-bold text-gray-800">${teamName}</h2>
              <span class="ml-3 bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
                ${players.length}名
              </span>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              ${players.map(player => `
                <div class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer" onclick="showPlayerDetail(${player.id})">
                  <div class="player-card-image">
                    ${player.photo_url ? `
                      <img src="${player.photo_url}" alt="${player.name}">
                    ` : `
                      <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);" class="text-white text-6xl">
                        <i class="fas fa-user-circle"></i>
                      </div>
                    `}
                    ${player.is_featured ? `
                      <div class="absolute top-2 right-2 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold" style="z-index: 10;">
                        <i class="fas fa-star mr-1"></i>注目
                      </div>
                    ` : ''}
                  </div>
                  
                  <div class="p-4">
                    <div class="flex items-center justify-between mb-2">
                      <h3 class="text-lg font-bold text-gray-800">${player.name}</h3>
                      ${player.uniform_number ? `
                        <span class="text-2xl font-bold text-blue-600">#${player.uniform_number}</span>
                      ` : ''}
                    </div>
                    
                    ${player.position ? `
                      <p class="text-sm text-gray-600 mb-3">
                        <i class="fas fa-running mr-1"></i>
                        ${player.position}
                      </p>
                    ` : ''}
                    
                    <div class="flex items-center gap-3 text-xs text-gray-500">
                      ${player.height ? `
                        <span><i class="fas fa-arrows-alt-v mr-1"></i>${player.height}cm</span>
                      ` : ''}
                      ${player.weight ? `
                        <span><i class="fas fa-weight mr-1"></i>${player.weight}kg</span>
                      ` : ''}
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        `
      }).join('')
    
    document.getElementById('players-list').innerHTML = html
    
  } catch (error) {
    console.error('注目選手の取得に失敗しました:', error)
    document.getElementById('players-list').innerHTML = `
      <div class="text-center py-12">
        <i class="fas fa-exclamation-circle text-6xl text-red-300 mb-4"></i>
        <p class="text-gray-600 text-lg">データの取得に失敗しました</p>
      </div>
    `
  }
}

/**
 * 選手詳細ページをレンダリング
 */
async function renderPlayerDetailPage(playerId) {
  const app = document.getElementById('app')
  app.innerHTML = renderHeader() + `
    <div class="container mx-auto px-4 py-12">
      <div class="text-center">
        <div class="loading mx-auto"></div>
        <p class="mt-4 text-gray-600">読み込み中...</p>
      </div>
    </div>
  `
  
  try {
    const response = await axios.get(`/api/players/${playerId}`)
    const player = response.data
    
    app.innerHTML = renderHeader() + `
      <div class="bg-gray-50 min-h-screen">
        <div class="container mx-auto px-4 py-8 max-w-4xl">
          <button onclick="navigateTo('home')" class="mb-6 text-gray-600 hover:text-gray-800 transition">
            <i class="fas fa-arrow-left mr-2"></i>トップページに戻る
          </button>
          
          <div class="bg-white rounded-lg shadow-xl overflow-hidden">
            <!-- プロフィール写真エリア -->
            <div class="relative bg-gradient-to-br from-blue-500 to-purple-600 h-96 flex items-center justify-center">
              ${player.photo_url ? `
                <img src="${player.photo_url}" alt="${player.name}" class="w-full h-full object-cover">
              ` : `
                <div class="text-white text-9xl">
                  <i class="fas fa-user-circle"></i>
                </div>
              `}
              <div class="absolute top-4 right-4 bg-yellow-500 text-white px-4 py-2 rounded-full font-bold">
                <i class="fas fa-star mr-2"></i>注目選手
              </div>
            </div>
            
            <!-- 基本情報 -->
            <div class="p-8">
              <div class="flex items-center justify-between mb-6">
                <h1 class="text-4xl font-bold text-gray-800">${player.name}</h1>
                ${player.uniform_number ? `
                  <span class="text-5xl font-bold text-blue-600">#${player.uniform_number}</span>
                ` : ''}
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div class="bg-gray-50 p-4 rounded-lg">
                  <p class="text-sm text-gray-600 mb-1">
                    <i class="fas ${getSportIcon(player.sport_type)} mr-2"></i>所属チーム
                  </p>
                  <p class="text-lg font-semibold text-gray-800">${player.team_name}</p>
                </div>
                
                ${player.position ? `
                  <div class="bg-gray-50 p-4 rounded-lg">
                    <p class="text-sm text-gray-600 mb-1">
                      <i class="fas fa-running mr-2"></i>ポジション
                    </p>
                    <p class="text-lg font-semibold text-gray-800">${player.position}</p>
                  </div>
                ` : ''}
                
                ${player.height ? `
                  <div class="bg-gray-50 p-4 rounded-lg">
                    <p class="text-sm text-gray-600 mb-1">
                      <i class="fas fa-arrows-alt-v mr-2"></i>身長
                    </p>
                    <p class="text-lg font-semibold text-gray-800">${player.height} cm</p>
                  </div>
                ` : ''}
                
                ${player.weight ? `
                  <div class="bg-gray-50 p-4 rounded-lg">
                    <p class="text-sm text-gray-600 mb-1">
                      <i class="fas fa-weight mr-2"></i>体重
                    </p>
                    <p class="text-lg font-semibold text-gray-800">${player.weight} kg</p>
                  </div>
                ` : ''}
                
                ${player.birthdate ? `
                  <div class="bg-gray-50 p-4 rounded-lg">
                    <p class="text-sm text-gray-600 mb-1">
                      <i class="fas fa-birthday-cake mr-2"></i>生年月日
                    </p>
                    <p class="text-lg font-semibold text-gray-800">${player.birthdate}</p>
                  </div>
                ` : ''}
                
                ${player.hometown ? `
                  <div class="bg-gray-50 p-4 rounded-lg">
                    <p class="text-sm text-gray-600 mb-1">
                      <i class="fas fa-map-marker-alt mr-2"></i>出身地
                    </p>
                    <p class="text-lg font-semibold text-gray-800">${player.hometown}</p>
                  </div>
                ` : ''}
              </div>
              
              <!-- プロフィール -->
              ${player.bio ? `
                <div class="mb-8">
                  <h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                    <i class="fas fa-user-alt mr-3 text-blue-600"></i>プロフィール
                  </h2>
                  <div class="bg-blue-50 p-6 rounded-lg">
                    <p class="text-gray-700 leading-relaxed whitespace-pre-line">${player.bio}</p>
                  </div>
                </div>
              ` : ''}
              
              <!-- エピソード -->
              ${player.episode ? `
                <div class="mb-8">
                  <h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                    <i class="fas fa-heart mr-3 text-pink-600"></i>エピソード
                  </h2>
                  <div class="bg-pink-50 p-6 rounded-lg border-l-4 border-pink-500">
                    <p class="text-gray-700 leading-relaxed whitespace-pre-line">${player.episode}</p>
                  </div>
                </div>
              ` : ''}
              
              <!-- ソーシャルリンク -->
              ${player.social_links ? `
                <div class="flex items-center gap-4 pt-6 border-t border-gray-200">
                  <p class="text-gray-600 font-semibold">SNS:</p>
                  ${player.social_links.split(',').map(link => `
                    <a href="${link.trim()}" target="_blank" rel="noopener noreferrer" 
                       class="text-blue-600 hover:text-blue-800 transition">
                      <i class="fas fa-external-link-alt mr-1"></i>リンク
                    </a>
                  `).join('')}
                </div>
              ` : ''}
            </div>
          </div>
          
          <!-- 戻るボタン -->
          <div class="mt-8 text-center">
            <button onclick="navigateTo('home')" 
                    class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition">
              <i class="fas fa-home mr-2"></i>トップページに戻る
            </button>
          </div>
        </div>
      </div>
    ` + renderFooter()
    
  } catch (error) {
    console.error('選手情報の取得に失敗しました:', error)
    app.innerHTML = renderHeader() + `
      <div class="bg-gray-50 min-h-screen">
        <div class="container mx-auto px-4 py-8">
          <button onclick="navigateTo('home')" class="mb-6 text-gray-600 hover:text-gray-800 transition">
            <i class="fas fa-arrow-left mr-2"></i>トップページに戻る
          </button>
          
          <div class="text-center py-20">
            <i class="fas fa-exclamation-circle text-6xl text-red-300 mb-6"></i>
            <h2 class="text-2xl font-bold text-gray-800 mb-3">選手情報の取得に失敗しました</h2>
            <p class="text-gray-600 mb-8">選手が見つからないか、データの読み込みに失敗しました。</p>
            <button onclick="navigateTo('home')" 
                    class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition">
              <i class="fas fa-home mr-2"></i>トップページに戻る
            </button>
          </div>
        </div>
      </div>
    ` + renderFooter()
  }
}

/**
 * 運営者情報ページを表示
 */
function showOperatorInfo() {
  const app = document.getElementById('app')
  app.innerHTML = renderHeader() + `
    <div class="bg-gray-50 min-h-screen">
      <div class="container mx-auto px-4 py-8">
        <button onclick="navigateTo('home')" class="mb-4 text-gray-600 hover:text-gray-800">
          <i class="fas fa-arrow-left mr-2"></i>トップページに戻る
        </button>
        
        <div class="bg-white rounded-lg shadow-lg overflow-hidden max-w-3xl mx-auto">
          <div class="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8">
            <h1 class="text-4xl font-bold mb-2">
              <i class="fas fa-info-circle mr-3"></i>運営事務局
            </h1>
            <p class="text-xl opacity-90">Tochispo LIFE運営事務局</p>
          </div>
          
          <div class="p-8">
            <div class="mb-8">
              <h2 class="text-2xl font-bold text-gray-800 mb-4">
                <i class="fas fa-heart text-red-500 mr-2"></i>サイトについて
              </h2>
              <p class="text-gray-700 leading-relaxed mb-4">
                「Tochispo LIFE（とちスポLIFE）」は、栃木県のプロスポーツを応援する情報サイトです。
              </p>
              <p class="text-gray-700 leading-relaxed mb-4">
                宇都宮ブレックス、栃木SC、H.C.栃木日光アイスバックス、宇都宮ブリッツェン、栃木ゴールデンブレーブス、栃木シティフットボールクラブの6チームの試合情報、選手紹介、観戦ガイドなどを掲載しています。
              </p>
              <p class="text-gray-700 leading-relaxed">
                「栃木のプロスポーツをもっと身近に」をテーマに、地域の皆様がスポーツ観戦を楽しめるよう情報を発信しています。
              </p>
            </div>
            
            <div class="border-t border-gray-200 pt-6">
              <h2 class="text-xl font-bold text-gray-800 mb-4">運営事務局情報</h2>
              <div class="space-y-3">
                <div>
                  <p class="text-sm text-gray-600 mb-1">事務局名</p>
                  <p class="text-gray-800 font-semibold">Tochispo LIFE運営事務局</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600 mb-1">運営</p>
                  <p class="text-gray-800">irohaコンサルティング</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600 mb-1">お問い合わせ</p>
                  <p class="text-gray-800">
                    <a href="mailto:info@irohacs.com" class="text-blue-600 hover:text-blue-800 underline">
                      <i class="fas fa-envelope mr-2"></i>info@irohacs.com
                    </a>
                  </p>
                </div>
              </div>
            </div>
            
            <div class="mt-8 border-t border-gray-200 pt-6">
              <h3 class="text-lg font-bold text-gray-800 mb-3">
                <i class="fas fa-question-circle text-blue-600 mr-2"></i>お問い合わせ
              </h3>
              <p class="text-gray-700 mb-4">
                サイトに関するご質問・ご意見・情報提供などがございましたら、お気軽にお問い合わせください。
              </p>
              <a href="mailto:info@irohacs.com" class="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition">
                <i class="fas fa-envelope mr-2"></i>メールでお問い合わせ
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  ` + renderFooter()
}

// ==========================================
// アプリケーション初期化
// ==========================================

/**
 * URLからページをルーティング
 */
function routePage() {
  const path = window.location.pathname
  
  if (path === '/' || path === '') {
    navigateTo('home', false)
  } else if (path.startsWith('/players/')) {
    const playerId = path.replace('/players/', '')
    navigateTo(`players/${playerId}`, false)
  } else if (path.startsWith('/guides/')) {
    const slug = path.replace('/guides/', '')
    navigateTo(`guides/${slug}`, false)
  } else if (path === '/players') {
    navigateTo('players', false)
  } else if (path === '/family-guide') {
    navigateTo('seo-page/family-guide', false)
  } else if (path === '/outing-spots') {
    navigateTo('seo-page/outing-spots', false)
  } else if (path === '/faq') {
    navigateTo('seo-page/faq', false)
  } else {
    // デフォルトはホームページ
    navigateTo('home', false)
  }
}

// ブラウザの戻る/進むボタンへの対応
window.addEventListener('popstate', (event) => {
  if (event.state && event.state.page) {
    navigateTo(event.state.page, false)
  } else {
    routePage()
  }
})

document.addEventListener('DOMContentLoaded', () => {
  console.log('Tochispo LIFE - アプリケーション起動')
  routePage()
})

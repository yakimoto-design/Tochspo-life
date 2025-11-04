// ==========================================
// TOCHIGI SPORTS LIFE - 管理画面
// ==========================================

// 管理画面の状態管理
const AdminState = {
  currentView: 'dashboard',
  teams: [],
  matches: [],
  players: [],
  venues: [],
  guides: [],
  localSpots: [],
  credentials: null
}

// Basic認証のヘッダーを設定
function getAuthHeaders() {
  if (!AdminState.credentials) {
    const username = prompt('管理者ユーザー名を入力してください:')
    const password = prompt('パスワードを入力してください:')
    AdminState.credentials = btoa(`${username}:${password}`)
  }
  
  return {
    'Authorization': `Basic ${AdminState.credentials}`
  }
}

// ==========================================
// ダッシュボード
// ==========================================

async function renderDashboard() {
  const app = document.getElementById('admin-app')
  
  app.innerHTML = `
    <div class="min-h-screen bg-gray-100">
      <header class="bg-white shadow-md">
        <div class="max-w-7xl mx-auto px-4 py-4">
          <div class="flex items-center justify-between">
            <h1 class="text-2xl font-bold text-gray-800">
              <i class="fas fa-cog mr-2"></i>
              TOCHIGI SPORTS LIFE 管理画面
            </h1>
            <a href="/" class="text-blue-600 hover:text-blue-800">
              <i class="fas fa-home mr-2"></i>サイトに戻る
            </a>
          </div>
        </div>
      </header>
      
      <div class="max-w-7xl mx-auto px-4 py-8">
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 class="text-xl font-bold text-gray-800 mb-4">管理メニュー</h2>
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            <button onclick="renderDashboard()" class="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm">
              <i class="fas fa-th-large mr-1"></i>ダッシュボード
            </button>
            <button onclick="renderTeamsManager()" class="px-3 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition text-sm">
              <i class="fas fa-shield-alt mr-1"></i>チーム管理
            </button>
            <button onclick="renderMatchesManager()" class="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition text-sm">
              <i class="fas fa-calendar-alt mr-1"></i>試合管理
            </button>
            <button onclick="renderPlayersManager()" class="px-3 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition text-sm">
              <i class="fas fa-users mr-1"></i>選手管理
            </button>
            <button onclick="renderGuidesManager()" class="px-3 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition text-sm">
              <i class="fas fa-book mr-1"></i>記事管理
            </button>
            <button onclick="renderLocalSpotsManager()" class="px-3 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 transition text-sm">
              <i class="fas fa-map-marker-alt mr-1"></i>周辺情報
            </button>
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="bg-white rounded-lg shadow-md p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600 text-sm">チーム数</p>
                <p class="text-3xl font-bold text-yellow-600">${AdminState.teams.length}</p>
              </div>
              <i class="fas fa-shield-alt text-4xl text-yellow-600"></i>
            </div>
          </div>
          
          <div class="bg-white rounded-lg shadow-md p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600 text-sm">試合数</p>
                <p class="text-3xl font-bold text-green-600">${AdminState.matches.length}</p>
              </div>
              <i class="fas fa-calendar-alt text-4xl text-green-600"></i>
            </div>
          </div>
          
          <div class="bg-white rounded-lg shadow-md p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600 text-sm">選手数</p>
                <p class="text-3xl font-bold text-purple-600">${AdminState.players.length}</p>
              </div>
              <i class="fas fa-users text-4xl text-purple-600"></i>
            </div>
          </div>
          
          <div class="bg-white rounded-lg shadow-md p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600 text-sm">記事数</p>
                <p class="text-3xl font-bold text-orange-600">${AdminState.guides.length}</p>
              </div>
              <i class="fas fa-book text-4xl text-orange-600"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
}

// ==========================================
// 記事管理
// ==========================================

async function renderGuidesManager() {
  const response = await axios.get('/api/guides')
  AdminState.guides = response.data
  
  const app = document.getElementById('admin-app')
  
  app.innerHTML = `
    <div class="min-h-screen bg-gray-100">
      <header class="bg-white shadow-md">
        <div class="max-w-7xl mx-auto px-4 py-4">
          <div class="flex items-center justify-between">
            <h1 class="text-2xl font-bold text-gray-800">
              <i class="fas fa-book mr-2 text-orange-600"></i>ガイド記事管理
            </h1>
            <button onclick="renderDashboard()" class="text-blue-600 hover:text-blue-800">
              <i class="fas fa-arrow-left mr-2"></i>ダッシュボードに戻る
            </button>
          </div>
        </div>
      </header>
      
      <div class="max-w-7xl mx-auto px-4 py-8">
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-bold text-gray-800">登録済み記事一覧</h2>
            <button onclick="showAddGuideModal()" class="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded">
              <i class="fas fa-plus mr-2"></i>記事を追加
            </button>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${AdminState.guides.map(guide => `
              <div class="bg-gray-50 rounded-lg p-6 border-2 border-gray-200 hover:border-orange-400 transition">
                <div class="flex items-start justify-between mb-4">
                  <div class="flex items-center">
                    <div class="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                      <i class="fas ${guide.icon || 'fa-book'} text-2xl text-orange-600"></i>
                    </div>
                    <div>
                      <h3 class="font-bold text-gray-800">${guide.title}</h3>
                      <p class="text-xs text-gray-500">${guide.sport_type}</p>
                    </div>
                  </div>
                  ${guide.is_published ? 
                    '<span class="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded">公開中</span>' : 
                    '<span class="bg-gray-100 text-gray-800 text-xs font-semibold px-2 py-1 rounded">非公開</span>'
                  }
                </div>
                
                ${guide.description ? `
                  <p class="text-sm text-gray-600 mb-4 line-clamp-2">${guide.description}</p>
                ` : ''}
                
                <div class="flex gap-2 mt-4">
                  <button onclick="showEditGuideModal(${guide.id})" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 px-3 rounded">
                    <i class="fas fa-edit mr-1"></i>編集
                  </button>
                  <button onclick="deleteGuide(${guide.id}, '${guide.title}')" class="bg-red-600 hover:bg-red-700 text-white text-sm py-2 px-3 rounded">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `
}

function showAddGuideModal() {
  // ページトップにスクロール
  window.scrollTo({ top: 0, behavior: 'smooth' })
  
  const iconOptions = [
    { value: 'fa-basketball-ball', label: 'バスケットボール' },
    { value: 'fa-hockey-puck', label: 'ホッケー' },
    { value: 'fa-futbol', label: 'サッカー' },
    { value: 'fa-baseball-ball', label: '野球' },
    { value: 'fa-biking', label: 'サイクリング' },
    { value: 'fa-running', label: 'ランニング' },
    { value: 'fa-swimming-pool', label: 'スイミング' },
    { value: 'fa-book', label: '本/ガイド' },
    { value: 'fa-users', label: 'ユーザー' },
    { value: 'fa-star', label: 'スター' }
  ]
  
  const modalHTML = `
    <div id="guide-modal" class="modal active">
      <div class="modal-content" style="max-width: 800px;">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-bold text-gray-800">
            <i class="fas fa-plus-circle mr-2 text-orange-600"></i>新規記事追加
          </h2>
          <button onclick="closeGuideModal()" class="text-gray-600 hover:text-gray-800 text-2xl">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <form id="guide-form" class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="mb-4 md:col-span-2">
              <label class="block text-sm font-bold text-gray-700 mb-2">タイトル <span class="text-red-500">*</span></label>
              <input type="text" name="title" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
            </div>
            
            <div class="mb-4">
              <label class="block text-sm font-bold text-gray-700 mb-2">スポーツ種目 <span class="text-red-500">*</span></label>
              <input type="text" name="sport_type" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
            </div>
            
            <div class="mb-4">
              <label class="block text-sm font-bold text-gray-700 mb-2">スラッグ（URL） <span class="text-red-500">*</span></label>
              <input type="text" name="slug" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="例: basketball-guide">
            </div>
            
            <div class="mb-4">
              <label class="block text-sm font-bold text-gray-700 mb-2">アイコン</label>
              <select name="icon" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                ${iconOptions.map(opt => `<option value="${opt.value}">${opt.label}</option>`).join('')}
              </select>
            </div>
            
            <div class="mb-4">
              <label class="block text-sm font-bold text-gray-700 mb-2">公開状態</label>
              <select name="is_published" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                <option value="1">公開</option>
                <option value="0">非公開</option>
              </select>
            </div>
            
            <div class="mb-4 md:col-span-2">
              <label class="block text-sm font-bold text-gray-700 mb-2">説明文</label>
              <textarea name="description" rows="2" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"></textarea>
            </div>
            
            <div class="mb-4 md:col-span-2">
              <label class="block text-sm font-bold text-gray-700 mb-2">本文 <span class="text-red-500">*</span></label>
              <textarea name="content" rows="10" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"></textarea>
              <p class="text-xs text-gray-500 mt-1">
                HTMLタグを使用できます。改行は&lt;br&gt;、段落は&lt;p&gt;タグを使用してください。
              </p>
            </div>
          </div>
          
          <div class="flex justify-end gap-2 mt-6">
            <button type="button" onclick="closeGuideModal()" class="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg transition">
              キャンセル
            </button>
            <button type="submit" class="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition">
              <i class="fas fa-save mr-2"></i>保存
            </button>
          </div>
        </form>
      </div>
    </div>
  `
  
  document.body.insertAdjacentHTML('beforeend', modalHTML)
  
  document.getElementById('guide-form').addEventListener('submit', async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const data = {
      title: formData.get('title'),
      sport_type: formData.get('sport_type'),
      slug: formData.get('slug'),
      icon: formData.get('icon'),
      description: formData.get('description'),
      content: formData.get('content'),
      is_published: parseInt(formData.get('is_published')),
      sections: null,
      tips: null,
      recommended_items: null,
      image_url: null
    }
    
    try {
      await axios.post('/api/admin/guides', data, { headers: getAuthHeaders() })
      closeGuideModal()
      alert('記事を追加しました！')
      renderGuidesManager()
    } catch (error) {
      alert('エラーが発生しました: ' + (error.response?.data?.error || error.message))
    }
  })
}

async function showEditGuideModal(id) {
  // ページトップにスクロール
  window.scrollTo({ top: 0, behavior: 'smooth' })
  
  const guide = AdminState.guides.find(g => g.id === id)
  if (!guide) return
  
  const iconOptions = [
    { value: 'fa-basketball-ball', label: 'バスケットボール' },
    { value: 'fa-hockey-puck', label: 'ホッケー' },
    { value: 'fa-futbol', label: 'サッカー' },
    { value: 'fa-baseball-ball', label: '野球' },
    { value: 'fa-biking', label: 'サイクリング' },
    { value: 'fa-running', label: 'ランニング' },
    { value: 'fa-swimming-pool', label: 'スイミング' },
    { value: 'fa-book', label: '本/ガイド' },
    { value: 'fa-users', label: 'ユーザー' },
    { value: 'fa-star', label: 'スター' }
  ]
  
  const modalHTML = `
    <div id="guide-modal" class="modal active">
      <div class="modal-content" style="max-width: 800px;">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-bold text-gray-800">
            <i class="fas fa-edit mr-2 text-blue-600"></i>記事編集
          </h2>
          <button onclick="closeGuideModal()" class="text-gray-600 hover:text-gray-800 text-2xl">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <form id="guide-form" class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="mb-4 md:col-span-2">
              <label class="block text-sm font-bold text-gray-700 mb-2">タイトル <span class="text-red-500">*</span></label>
              <input type="text" name="title" value="${guide.title}" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            
            <div class="mb-4">
              <label class="block text-sm font-bold text-gray-700 mb-2">スポーツ種目 <span class="text-red-500">*</span></label>
              <input type="text" name="sport_type" value="${guide.sport_type}" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            
            <div class="mb-4">
              <label class="block text-sm font-bold text-gray-700 mb-2">スラッグ（URL） <span class="text-red-500">*</span></label>
              <input type="text" name="slug" value="${guide.slug}" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            
            <div class="mb-4">
              <label class="block text-sm font-bold text-gray-700 mb-2">アイコン</label>
              <select name="icon" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                ${iconOptions.map(opt => `<option value="${opt.value}" ${guide.icon === opt.value ? 'selected' : ''}>${opt.label}</option>`).join('')}
              </select>
            </div>
            
            <div class="mb-4">
              <label class="block text-sm font-bold text-gray-700 mb-2">公開状態</label>
              <select name="is_published" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="1" ${guide.is_published === 1 ? 'selected' : ''}>公開</option>
                <option value="0" ${guide.is_published === 0 ? 'selected' : ''}>非公開</option>
              </select>
            </div>
            
            <div class="mb-4 md:col-span-2">
              <label class="block text-sm font-bold text-gray-700 mb-2">説明文</label>
              <textarea name="description" rows="2" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">${guide.description || ''}</textarea>
            </div>
            
            <div class="mb-4 md:col-span-2">
              <label class="block text-sm font-bold text-gray-700 mb-2">本文 <span class="text-red-500">*</span></label>
              <textarea name="content" rows="10" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">${guide.content}</textarea>
              <p class="text-xs text-gray-500 mt-1">
                HTMLタグを使用できます。改行は&lt;br&gt;、段落は&lt;p&gt;タグを使用してください。
              </p>
            </div>
          </div>
          
          <div class="flex justify-end gap-2 mt-6">
            <button type="button" onclick="closeGuideModal()" class="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg transition">
              キャンセル
            </button>
            <button type="submit" class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
              <i class="fas fa-save mr-2"></i>更新
            </button>
          </div>
        </form>
      </div>
    </div>
  `
  
  document.body.insertAdjacentHTML('beforeend', modalHTML)
  
  document.getElementById('guide-form').addEventListener('submit', async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const data = {
      title: formData.get('title'),
      sport_type: formData.get('sport_type'),
      slug: formData.get('slug'),
      icon: formData.get('icon'),
      description: formData.get('description'),
      content: formData.get('content'),
      is_published: parseInt(formData.get('is_published'))
    }
    
    try {
      await axios.put(`/api/admin/guides/${id}`, data, { headers: getAuthHeaders() })
      closeGuideModal()
      alert('記事を更新しました！')
      renderGuidesManager()
    } catch (error) {
      alert('エラーが発生しました: ' + (error.response?.data?.error || error.message))
    }
  })
}

async function deleteGuide(id, title) {
  if (!confirm(`「${title}」を削除してもよろしいですか？`)) {
    return
  }
  
  try {
    await axios.delete(`/api/admin/guides/${id}`, { headers: getAuthHeaders() })
    alert('記事を削除しました')
    renderGuidesManager()
  } catch (error) {
    alert('エラーが発生しました: ' + (error.response?.data?.error || error.message))
  }
}

function closeGuideModal() {
  const modal = document.getElementById('guide-modal')
  if (modal) {
    modal.remove()
  }
}

// ==========================================
// 簡略版：その他の管理機能（チーム・試合・選手・周辺情報）
// ==========================================

async function renderTeamsManager() {
  const response = await axios.get('/api/teams')
  AdminState.teams = response.data
  
  const app = document.getElementById('admin-app')
  app.innerHTML = `
    <div class="min-h-screen bg-gray-100">
      <header class="bg-white shadow-md">
        <div class="max-w-7xl mx-auto px-4 py-4">
          <div class="flex items-center justify-between">
            <h1 class="text-2xl font-bold text-gray-800">
              <i class="fas fa-shield-alt mr-2 text-yellow-600"></i>チーム管理
            </h1>
            <button onclick="renderDashboard()" class="text-blue-600 hover:text-blue-800">
              <i class="fas fa-arrow-left mr-2"></i>ダッシュボードに戻る
            </button>
          </div>
        </div>
      </header>
      
      <div class="max-w-7xl mx-auto px-4 py-8">
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-bold text-gray-800 mb-4">登録済みチーム一覧（${AdminState.teams.length}チーム）</h2>
          <div class="overflow-x-auto">
            <table class="min-w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">チーム名</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">スポーツ</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">リーグ</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ホーム会場</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                ${AdminState.teams.map(team => `
                  <tr>
                    <td class="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${team.name}</td>
                    <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">${team.sport_type}</td>
                    <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">${team.league || '-'}</td>
                    <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">${team.venue_name || '-'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `
}

async function renderMatchesManager() {
  const [matchesRes, teamsRes, venuesRes] = await Promise.all([
    axios.get('/api/matches'),
    axios.get('/api/teams'),
    axios.get('/api/venues')
  ])
  
  AdminState.matches = matchesRes.data
  AdminState.teams = teamsRes.data
  AdminState.venues = venuesRes.data
  
  const app = document.getElementById('admin-app')
  app.innerHTML = `
    <div class="min-h-screen bg-gray-100">
      <header class="bg-white shadow-md">
        <div class="max-w-7xl mx-auto px-4 py-4">
          <div class="flex items-center justify-between">
            <h1 class="text-2xl font-bold text-gray-800">
              <i class="fas fa-calendar-alt mr-2 text-green-600"></i>試合管理
            </h1>
            <button onclick="renderDashboard()" class="text-blue-600 hover:text-blue-800">
              <i class="fas fa-arrow-left mr-2"></i>ダッシュボードに戻る
            </button>
          </div>
        </div>
      </header>
      
      <div class="max-w-7xl mx-auto px-4 py-8">
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-bold text-gray-800">登録済み試合一覧（${AdminState.matches.length}試合）</h2>
            <button onclick="showAddMatchModal()" class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
              <i class="fas fa-plus mr-2"></i>試合を追加
            </button>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">日時</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">チーム</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">対戦相手</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">会場</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                ${AdminState.matches.slice(0, 50).map(match => `
                  <tr>
                    <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">${dayjs(match.match_date).format('YYYY/MM/DD HH:mm')}</td>
                    <td class="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${match.team_name}</td>
                    <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">vs ${match.opponent_team}</td>
                    <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">${match.venue_name || '-'}</td>
                    <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button onclick="showEditMatchModal(${match.id})" class="text-blue-600 hover:text-blue-800 mr-3">
                        <i class="fas fa-edit"></i>
                      </button>
                      <button onclick="deleteMatch(${match.id}, '${match.team_name} vs ${match.opponent_team}')" class="text-red-600 hover:text-red-800">
                        <i class="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `
}

async function renderPlayersManager() {
  const [playersRes, teamsRes] = await Promise.all([
    axios.get('/api/players'),
    axios.get('/api/teams')
  ])
  
  AdminState.players = playersRes.data
  AdminState.teams = teamsRes.data
  
  const app = document.getElementById('admin-app')
  app.innerHTML = `
    <div class="min-h-screen bg-gray-100">
      <header class="bg-white shadow-md">
        <div class="max-w-7xl mx-auto px-4 py-4">
          <div class="flex items-center justify-between">
            <h1 class="text-2xl font-bold text-gray-800">
              <i class="fas fa-users mr-2 text-purple-600"></i>選手管理
            </h1>
            <button onclick="renderDashboard()" class="text-blue-600 hover:text-blue-800">
              <i class="fas fa-arrow-left mr-2"></i>ダッシュボードに戻る
            </button>
          </div>
        </div>
      </header>
      
      <div class="max-w-7xl mx-auto px-4 py-8">
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-bold text-gray-800">登録済み選手一覧（${AdminState.players.length}名）</h2>
            <button onclick="showAddPlayerModal()" class="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
              <i class="fas fa-plus mr-2"></i>選手を追加
            </button>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">選手名</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">チーム</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">背番号</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ポジション</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                ${AdminState.players.slice(0, 50).map(player => `
                  <tr>
                    <td class="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${player.name}</td>
                    <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">${player.team_name}</td>
                    <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">${player.uniform_number || '-'}</td>
                    <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">${player.position || '-'}</td>
                    <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button onclick="showEditPlayerModal(${player.id})" class="text-blue-600 hover:text-blue-800 mr-3">
                        <i class="fas fa-edit"></i>
                      </button>
                      <button onclick="deletePlayer(${player.id}, '${player.name}')" class="text-red-600 hover:text-red-800">
                        <i class="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `
}

async function renderLocalSpotsManager() {
  const response = await axios.get('/api/local-spots')
  AdminState.localSpots = response.data
  
  const app = document.getElementById('admin-app')
  app.innerHTML = `
    <div class="min-h-screen bg-gray-100">
      <header class="bg-white shadow-md">
        <div class="max-w-7xl mx-auto px-4 py-4">
          <div class="flex items-center justify-between">
            <h1 class="text-2xl font-bold text-gray-800">
              <i class="fas fa-map-marker-alt mr-2 text-pink-600"></i>周辺スポット管理
            </h1>
            <button onclick="renderDashboard()" class="text-blue-600 hover:text-blue-800">
              <i class="fas fa-arrow-left mr-2"></i>ダッシュボードに戻る
            </button>
          </div>
        </div>
      </header>
      
      <div class="max-w-7xl mx-auto px-4 py-8">
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-bold text-gray-800 mb-4">登録済みスポット一覧（${AdminState.localSpots.length}件）</h2>
          <div class="overflow-x-auto">
            <table class="min-w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">スポット名</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">カテゴリー</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">会場</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">徒歩</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                ${AdminState.localSpots.slice(0, 20).map(spot => `
                  <tr>
                    <td class="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${spot.name}</td>
                    <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">${spot.category}</td>
                    <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">${spot.venue_name || '-'}</td>
                    <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">${spot.walking_time ? spot.walking_time + '分' : '-'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `
}

// ==========================================
// 試合管理モーダル
// ==========================================

function showAddMatchModal() {
  // ページトップにスクロール
  window.scrollTo({ top: 0, behavior: 'smooth' })
  
  const modalHTML = `
    <div id="match-modal" class="modal active">
      <div class="modal-content" style="max-width: 800px;">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-bold text-gray-800">
            <i class="fas fa-plus-circle mr-2 text-green-600"></i>新規試合追加
          </h2>
          <button onclick="closeMatchModal()" class="text-gray-600 hover:text-gray-800 text-2xl">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <form id="match-form" class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="mb-4">
              <label class="block text-sm font-bold text-gray-700 mb-2">チーム <span class="text-red-500">*</span></label>
              <select name="team_id" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
                <option value="">選択してください</option>
                ${AdminState.teams.map(team => `<option value="${team.id}">${team.name}</option>`).join('')}
              </select>
            </div>
            
            <div class="mb-4">
              <label class="block text-sm font-bold text-gray-700 mb-2">対戦相手 <span class="text-red-500">*</span></label>
              <input type="text" name="opponent_team" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="例: 川崎ブレイブサンダース">
            </div>
            
            <div class="mb-4">
              <label class="block text-sm font-bold text-gray-700 mb-2">試合日時 <span class="text-red-500">*</span></label>
              <input type="datetime-local" name="match_date" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
            </div>
            
            <div class="mb-4">
              <label class="block text-sm font-bold text-gray-700 mb-2">会場 <span class="text-red-500">*</span></label>
              <select name="venue_id" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
                <option value="">選択してください</option>
                ${AdminState.venues.map(venue => `<option value="${venue.id}">${venue.name}</option>`).join('')}
              </select>
            </div>
            
            <div class="mb-4 md:col-span-2">
              <label class="block text-sm font-bold text-gray-700 mb-2">チケットURL</label>
              <input type="url" name="ticket_url" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="https://...">
            </div>
            
            <div class="mb-4 md:col-span-2">
              <label class="block text-sm font-bold text-gray-700 mb-2">備考</label>
              <textarea name="notes" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="試合に関する追加情報"></textarea>
            </div>
          </div>
          
          <div class="flex justify-end gap-2 mt-6">
            <button type="button" onclick="closeMatchModal()" class="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg transition">
              キャンセル
            </button>
            <button type="submit" class="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition">
              <i class="fas fa-save mr-2"></i>保存
            </button>
          </div>
        </form>
      </div>
    </div>
  `
  
  document.body.insertAdjacentHTML('beforeend', modalHTML)
  
  document.getElementById('match-form').addEventListener('submit', async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const data = {
      team_id: parseInt(formData.get('team_id')),
      opponent_team: formData.get('opponent_team'),
      match_date: formData.get('match_date'),
      venue_id: parseInt(formData.get('venue_id')),
      ticket_url: formData.get('ticket_url') || null,
      notes: formData.get('notes') || null,
      result: null,
      home_score: null,
      away_score: null
    }
    
    try {
      await axios.post('/api/admin/matches', data, { headers: getAuthHeaders() })
      closeMatchModal()
      alert('試合を追加しました！')
      renderMatchesManager()
    } catch (error) {
      alert('エラーが発生しました: ' + (error.response?.data?.error || error.message))
    }
  })
}

async function showEditMatchModal(id) {
  // ページトップにスクロール
  window.scrollTo({ top: 0, behavior: 'smooth' })
  
  const match = AdminState.matches.find(m => m.id === id)
  if (!match) return
  
  // datetime-local形式に変換（YYYY-MM-DDTHH:mm）
  const matchDate = new Date(match.match_date)
  const datetimeLocal = matchDate.toISOString().slice(0, 16)
  
  const modalHTML = `
    <div id="match-modal" class="modal active">
      <div class="modal-content" style="max-width: 800px;">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-bold text-gray-800">
            <i class="fas fa-edit mr-2 text-blue-600"></i>試合編集
          </h2>
          <button onclick="closeMatchModal()" class="text-gray-600 hover:text-gray-800 text-2xl">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <form id="match-form" class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="mb-4">
              <label class="block text-sm font-bold text-gray-700 mb-2">チーム <span class="text-red-500">*</span></label>
              <select name="team_id" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                ${AdminState.teams.map(team => `<option value="${team.id}" ${match.team_id === team.id ? 'selected' : ''}>${team.name}</option>`).join('')}
              </select>
            </div>
            
            <div class="mb-4">
              <label class="block text-sm font-bold text-gray-700 mb-2">対戦相手 <span class="text-red-500">*</span></label>
              <input type="text" name="opponent_team" value="${match.opponent_team}" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            
            <div class="mb-4">
              <label class="block text-sm font-bold text-gray-700 mb-2">試合日時 <span class="text-red-500">*</span></label>
              <input type="datetime-local" name="match_date" value="${datetimeLocal}" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            
            <div class="mb-4">
              <label class="block text-sm font-bold text-gray-700 mb-2">会場 <span class="text-red-500">*</span></label>
              <select name="venue_id" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                ${AdminState.venues.map(venue => `<option value="${venue.id}" ${match.venue_id === venue.id ? 'selected' : ''}>${venue.name}</option>`).join('')}
              </select>
            </div>
            
            <div class="mb-4 md:col-span-2">
              <label class="block text-sm font-bold text-gray-700 mb-2">チケットURL</label>
              <input type="url" name="ticket_url" value="${match.ticket_url || ''}" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            
            <div class="mb-4 md:col-span-2">
              <label class="block text-sm font-bold text-gray-700 mb-2">備考</label>
              <textarea name="notes" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">${match.notes || ''}</textarea>
            </div>
          </div>
          
          <div class="flex justify-end gap-2 mt-6">
            <button type="button" onclick="closeMatchModal()" class="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg transition">
              キャンセル
            </button>
            <button type="submit" class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
              <i class="fas fa-save mr-2"></i>更新
            </button>
          </div>
        </form>
      </div>
    </div>
  `
  
  document.body.insertAdjacentHTML('beforeend', modalHTML)
  
  document.getElementById('match-form').addEventListener('submit', async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const data = {
      team_id: parseInt(formData.get('team_id')),
      opponent_team: formData.get('opponent_team'),
      match_date: formData.get('match_date'),
      venue_id: parseInt(formData.get('venue_id')),
      ticket_url: formData.get('ticket_url') || null,
      notes: formData.get('notes') || null
    }
    
    try {
      await axios.put(`/api/admin/matches/${id}`, data, { headers: getAuthHeaders() })
      closeMatchModal()
      alert('試合を更新しました！')
      renderMatchesManager()
    } catch (error) {
      alert('エラーが発生しました: ' + (error.response?.data?.error || error.message))
    }
  })
}

async function deleteMatch(id, description) {
  if (!confirm(`「${description}」を削除してもよろしいですか？`)) {
    return
  }
  
  try {
    await axios.delete(`/api/admin/matches/${id}`, { headers: getAuthHeaders() })
    alert('試合を削除しました')
    renderMatchesManager()
  } catch (error) {
    alert('エラーが発生しました: ' + (error.response?.data?.error || error.message))
  }
}

function closeMatchModal() {
  const modal = document.getElementById('match-modal')
  if (modal) {
    modal.remove()
  }
}

// ==========================================
// 選手管理モーダル
// ==========================================

function showAddPlayerModal() {
  const modalHTML = `
    <div id="player-modal" class="modal active">
      <div class="modal-content" style="max-width: 800px;">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-bold text-gray-800">
            <i class="fas fa-plus-circle mr-2 text-purple-600"></i>新規選手追加
          </h2>
          <button onclick="closePlayerModal()" class="text-gray-600 hover:text-gray-800 text-2xl">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <form id="player-form" class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="mb-4">
              <label class="block text-sm font-bold text-gray-700 mb-2">チーム <span class="text-red-500">*</span></label>
              <select name="team_id" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option value="">選択してください</option>
                ${AdminState.teams.map(team => `<option value="${team.id}">${team.name}</option>`).join('')}
              </select>
            </div>
            
            <div class="mb-4">
              <label class="block text-sm font-bold text-gray-700 mb-2">選手名 <span class="text-red-500">*</span></label>
              <input type="text" name="name" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="例: 山田 太郎">
            </div>
            
            <div class="mb-4">
              <label class="block text-sm font-bold text-gray-700 mb-2">背番号</label>
              <input type="number" name="uniform_number" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="例: 10">
            </div>
            
            <div class="mb-4">
              <label class="block text-sm font-bold text-gray-700 mb-2">ポジション</label>
              <input type="text" name="position" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="例: フォワード">
            </div>
            
            <div class="mb-4">
              <label class="block text-sm font-bold text-gray-700 mb-2">身長 (cm)</label>
              <input type="number" name="height" step="0.1" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="例: 185">
            </div>
            
            <div class="mb-4">
              <label class="block text-sm font-bold text-gray-700 mb-2">体重 (kg)</label>
              <input type="number" name="weight" step="0.1" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="例: 80">
            </div>
            
            <div class="mb-4">
              <label class="block text-sm font-bold text-gray-700 mb-2">生年月日</label>
              <input type="date" name="birthdate" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
            </div>
            
            <div class="mb-4">
              <label class="block text-sm font-bold text-gray-700 mb-2">出身地</label>
              <input type="text" name="hometown" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="例: 栃木県宇都宮市">
            </div>
            
            <div class="mb-4 md:col-span-2">
              <label class="block text-sm font-bold text-gray-700 mb-2">
                <i class="fas fa-image mr-1"></i>写真URL
              </label>
              <input type="url" name="photo_url" id="add_photo_url_input" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="https://example.com/photo.jpg" onchange="previewPlayerImage('add_photo_url_input', 'add_image_preview')">
              <p class="text-xs text-gray-500 mt-1">画像のURL（https://）を入力してください。Unsplash、Imgur等の画像URLが使用できます。</p>
              <div id="add_image_preview" class="mt-3 hidden">
                <p class="text-sm font-bold text-gray-700 mb-2">プレビュー:</p>
                <img src="" alt="Preview" class="w-48 h-48 object-cover rounded-lg border-2 border-gray-300 shadow-sm">
              </div>
            </div>
            
            <div class="mb-4 md:col-span-2">
              <label class="block text-sm font-bold text-gray-700 mb-2">
                <i class="fas fa-id-card mr-1"></i>プロフィール
              </label>
              <textarea name="bio" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="選手の経歴や実績など（例：元日本代表。2020年MVP受賞。）"></textarea>
              <p class="text-xs text-gray-500 mt-1">経歴、実績、プレースタイルなどの基本情報</p>
            </div>
            
            <div class="mb-4 md:col-span-2">
              <label class="block text-sm font-bold text-gray-700 mb-2">
                <i class="fas fa-heart mr-1 text-pink-500"></i>エピソード
              </label>
              <textarea name="episode" rows="4" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="選手の人柄がわかるエピソードを記入してください（例：試合前は必ずチームメイトを鼓舞する言葉をかける。練習後も若手選手の相談に乗る姿が見られる。）"></textarea>
              <p class="text-xs text-gray-500 mt-1">人柄や性格、習慣、ファンとの交流など、選手の個性が伝わるエピソード</p>
            </div>
            
            <div class="mb-4 md:col-span-2">
              <label class="flex items-center">
                <input type="checkbox" name="is_featured" value="1" class="mr-2">
                <span class="text-sm font-bold text-gray-700">注目選手として表示</span>
              </label>
            </div>
          </div>
          
          <div class="flex justify-end gap-2 mt-6">
            <button type="button" onclick="closePlayerModal()" class="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg transition">
              キャンセル
            </button>
            <button type="submit" class="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition">
              <i class="fas fa-save mr-2"></i>保存
            </button>
          </div>
        </form>
      </div>
    </div>
  `
  
  document.body.insertAdjacentHTML('beforeend', modalHTML)
  
  // モーダルを表示後、ページトップにスクロール
  window.scrollTo({ top: 0, behavior: 'smooth' })
  
  document.getElementById('player-form').addEventListener('submit', async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const data = {
      team_id: parseInt(formData.get('team_id')),
      name: formData.get('name'),
      uniform_number: formData.get('uniform_number') ? parseInt(formData.get('uniform_number')) : null,
      position: formData.get('position') || null,
      height: formData.get('height') ? parseFloat(formData.get('height')) : null,
      weight: formData.get('weight') ? parseFloat(formData.get('weight')) : null,
      birthdate: formData.get('birthdate') || null,
      hometown: formData.get('hometown') || null,
      photo_url: formData.get('photo_url') || null,
      bio: formData.get('bio') || null,
      episode: formData.get('episode') || null,
      is_featured: formData.get('is_featured') ? 1 : 0
    }
    
    try {
      await axios.post('/api/admin/players', data, { headers: getAuthHeaders() })
      closePlayerModal()
      alert('選手を追加しました！')
      renderPlayersManager()
    } catch (error) {
      alert('エラーが発生しました: ' + (error.response?.data?.error || error.message))
    }
  })
}

async function showEditPlayerModal(id) {
  const player = AdminState.players.find(p => p.id === id)
  if (!player) return
  
  const modalHTML = `
    <div id="player-modal" class="modal active">
      <div class="modal-content" style="max-width: 800px;">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-bold text-gray-800">
            <i class="fas fa-edit mr-2 text-blue-600"></i>選手編集
          </h2>
          <button onclick="closePlayerModal()" class="text-gray-600 hover:text-gray-800 text-2xl">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <form id="player-form" class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="mb-4">
              <label class="block text-sm font-bold text-gray-700 mb-2">チーム <span class="text-red-500">*</span></label>
              <select name="team_id" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                ${AdminState.teams.map(team => `<option value="${team.id}" ${player.team_id === team.id ? 'selected' : ''}>${team.name}</option>`).join('')}
              </select>
            </div>
            
            <div class="mb-4">
              <label class="block text-sm font-bold text-gray-700 mb-2">選手名 <span class="text-red-500">*</span></label>
              <input type="text" name="name" value="${player.name}" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            
            <div class="mb-4">
              <label class="block text-sm font-bold text-gray-700 mb-2">背番号</label>
              <input type="number" name="uniform_number" value="${player.uniform_number || ''}" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            
            <div class="mb-4">
              <label class="block text-sm font-bold text-gray-700 mb-2">ポジション</label>
              <input type="text" name="position" value="${player.position || ''}" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            
            <div class="mb-4">
              <label class="block text-sm font-bold text-gray-700 mb-2">身長 (cm)</label>
              <input type="number" name="height" step="0.1" value="${player.height || ''}" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            
            <div class="mb-4">
              <label class="block text-sm font-bold text-gray-700 mb-2">体重 (kg)</label>
              <input type="number" name="weight" step="0.1" value="${player.weight || ''}" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            
            <div class="mb-4">
              <label class="block text-sm font-bold text-gray-700 mb-2">生年月日</label>
              <input type="date" name="birthdate" value="${player.birthdate || ''}" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            
            <div class="mb-4">
              <label class="block text-sm font-bold text-gray-700 mb-2">出身地</label>
              <input type="text" name="hometown" value="${player.hometown || ''}" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            
            <div class="mb-4 md:col-span-2">
              <label class="block text-sm font-bold text-gray-700 mb-2">
                <i class="fas fa-image mr-1"></i>写真URL
              </label>
              <input type="url" name="photo_url" id="edit_photo_url_input" value="${player.photo_url || ''}" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" onchange="previewPlayerImage('edit_photo_url_input', 'edit_image_preview')">
              <p class="text-xs text-gray-500 mt-1">画像のURL（https://）を入力してください。Unsplash、Imgur等の画像URLが使用できます。</p>
              <div id="edit_image_preview" class="mt-3 ${player.photo_url ? '' : 'hidden'}">
                <p class="text-sm font-bold text-gray-700 mb-2">プレビュー:</p>
                <img src="${player.photo_url || ''}" alt="Preview" class="w-48 h-48 object-cover rounded-lg border-2 border-gray-300 shadow-sm">
              </div>
            </div>
            
            <div class="mb-4 md:col-span-2">
              <label class="block text-sm font-bold text-gray-700 mb-2">
                <i class="fas fa-id-card mr-1"></i>プロフィール
              </label>
              <textarea name="bio" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">${player.bio || ''}</textarea>
              <p class="text-xs text-gray-500 mt-1">経歴、実績、プレースタイルなどの基本情報</p>
            </div>
            
            <div class="mb-4 md:col-span-2">
              <label class="block text-sm font-bold text-gray-700 mb-2">
                <i class="fas fa-heart mr-1 text-pink-500"></i>エピソード
              </label>
              <textarea name="episode" rows="4" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">${player.episode || ''}</textarea>
              <p class="text-xs text-gray-500 mt-1">人柄や性格、習慣、ファンとの交流など、選手の個性が伝わるエピソード</p>
            </div>
            
            <div class="mb-4 md:col-span-2">
              <label class="flex items-center">
                <input type="checkbox" name="is_featured" value="1" ${player.is_featured ? 'checked' : ''} class="mr-2">
                <span class="text-sm font-bold text-gray-700">注目選手として表示</span>
              </label>
            </div>
          </div>
          
          <div class="flex justify-end gap-2 mt-6">
            <button type="button" onclick="closePlayerModal()" class="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg transition">
              キャンセル
            </button>
            <button type="submit" class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
              <i class="fas fa-save mr-2"></i>更新
            </button>
          </div>
        </form>
      </div>
    </div>
  `
  
  document.body.insertAdjacentHTML('beforeend', modalHTML)
  
  // モーダルを表示後、ページトップにスクロール
  window.scrollTo({ top: 0, behavior: 'smooth' })
  
  document.getElementById('player-form').addEventListener('submit', async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const data = {
      team_id: parseInt(formData.get('team_id')),
      name: formData.get('name'),
      uniform_number: formData.get('uniform_number') ? parseInt(formData.get('uniform_number')) : null,
      position: formData.get('position') || null,
      height: formData.get('height') ? parseFloat(formData.get('height')) : null,
      weight: formData.get('weight') ? parseFloat(formData.get('weight')) : null,
      birthdate: formData.get('birthdate') || null,
      hometown: formData.get('hometown') || null,
      photo_url: formData.get('photo_url') || null,
      bio: formData.get('bio') || null,
      episode: formData.get('episode') || null,
      is_featured: formData.get('is_featured') ? 1 : 0
    }
    
    try {
      await axios.put(`/api/admin/players/${id}`, data, { headers: getAuthHeaders() })
      closePlayerModal()
      alert('選手を更新しました！')
      renderPlayersManager()
    } catch (error) {
      alert('エラーが発生しました: ' + (error.response?.data?.error || error.message))
    }
  })
}

async function deletePlayer(id, name) {
  if (!confirm(`「${name}」を削除してもよろしいですか？`)) {
    return
  }
  
  try {
    await axios.delete(`/api/admin/players/${id}`, { headers: getAuthHeaders() })
    alert('選手を削除しました')
    renderPlayersManager()
  } catch (error) {
    alert('エラーが発生しました: ' + (error.response?.data?.error || error.message))
  }
}

function closePlayerModal() {
  const modal = document.getElementById('player-modal')
  if (modal) {
    modal.remove()
  }
}

// ==========================================
// 初期化
// ==========================================

document.addEventListener('DOMContentLoaded', async () => {
  console.log('TOCHIGI SPORTS LIFE 管理画面 - 起動')
  
  try {
    // データ取得
    const [teamsRes, matchesRes, playersRes, guidesRes] = await Promise.all([
      axios.get('/api/teams'),
      axios.get('/api/matches'),
      axios.get('/api/players'),
      axios.get('/api/guides')
    ])
    
    AdminState.teams = teamsRes.data
    AdminState.matches = matchesRes.data
    AdminState.players = playersRes.data
    AdminState.guides = guidesRes.data
    
    renderDashboard()
  } catch (error) {
    console.error('データ取得エラー:', error)
    document.getElementById('admin-app').innerHTML = `
      <div class="min-h-screen bg-gray-100 flex items-center justify-center">
        <div class="bg-white rounded-lg shadow-lg p-8 max-w-md">
          <i class="fas fa-exclamation-triangle text-6xl text-red-500 mb-4"></i>
          <h2 class="text-2xl font-bold text-gray-800 mb-4">エラー</h2>
          <p class="text-gray-600 mb-4">データの読み込みに失敗しました。</p>
          <button onclick="location.reload()" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            再読み込み
          </button>
        </div>
      </div>
    `
  }
})

/**
 * 画像プレビュー機能
 * @param {string} inputId - 入力フィールドのID
 * @param {string} previewId - プレビュー要素のID
 */
function previewPlayerImage(inputId, previewId) {
  const input = document.getElementById(inputId)
  const preview = document.getElementById(previewId)
  const img = preview.querySelector('img')
  
  if (!input || !preview || !img) return
  
  const url = input.value.trim()
  
  if (url && url.startsWith('http')) {
    // URLが入力されている場合、プレビューを表示
    img.src = url
    img.onerror = function() {
      // 画像の読み込みに失敗した場合
      preview.classList.add('hidden')
      alert('画像の読み込みに失敗しました。URLを確認してください。')
    }
    img.onload = function() {
      // 画像の読み込みに成功した場合、プレビューを表示
      preview.classList.remove('hidden')
    }
  } else {
    // URLが空の場合、プレビューを非表示
    preview.classList.add('hidden')
  }
}

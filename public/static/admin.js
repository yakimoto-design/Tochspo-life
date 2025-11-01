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
  const response = await axios.get('/api/matches')
  AdminState.matches = response.data
  
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
          <h2 class="text-xl font-bold text-gray-800 mb-4">登録済み試合一覧（${AdminState.matches.length}試合）</h2>
          <div class="overflow-x-auto">
            <table class="min-w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">日時</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">チーム</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">対戦相手</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">会場</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                ${AdminState.matches.slice(0, 20).map(match => `
                  <tr>
                    <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">${dayjs(match.match_date).format('YYYY/MM/DD HH:mm')}</td>
                    <td class="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${match.team_name}</td>
                    <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">vs ${match.opponent_team}</td>
                    <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">${match.venue_name || '-'}</td>
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
  const response = await axios.get('/api/players')
  AdminState.players = response.data
  
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
          <h2 class="text-xl font-bold text-gray-800 mb-4">登録済み選手一覧（${AdminState.players.length}名）</h2>
          <div class="overflow-x-auto">
            <table class="min-w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">選手名</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">チーム</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">背番号</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ポジション</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                ${AdminState.players.slice(0, 20).map(player => `
                  <tr>
                    <td class="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${player.name}</td>
                    <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">${player.team_name}</td>
                    <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">${player.uniform_number || '-'}</td>
                    <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">${player.position || '-'}</td>
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

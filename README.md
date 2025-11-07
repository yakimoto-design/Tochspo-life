# Tochispo LIFE（とちスポLIFE）

## プロジェクト概要

**名称**: Tochispo LIFE（とちスポLIFE）
**タグライン**: 栃木のプロスポーツをもっと身近に  
**目的**: 栃木県内の6つのプロスポーツチームを応援する総合スポーツ情報ポータルサイト

## サイトコンセプト

### 「栃木のプロスポーツをもっと身近に」

栃木県には、バスケットボール、サッカー、アイスホッケー、サイクルロードレース、野球など、多様なプロスポーツチームが存在します。しかし、それぞれのチーム情報が分散しており、「今日はどの試合がある？」「どのチームを応援しよう？」と思ったときに、まとめて情報を得られる場所がありませんでした。

**Tochispo LIFE**は、栃木県内の全プロスポーツチームの情報を一つの場所にまとめ、スポーツファンが：

- 📅 **試合スケジュール**を一目で確認できる
- ⭐ **注目選手**の人柄やエピソードを知れる
- 🎫 **観戦ガイド**で初心者でも安心して観戦できる
- 🏟️ **会場情報**や周辺スポットを探せる

栃木のスポーツをもっと楽しく、もっと身近に感じてもらうための情報ポータルサイトです。

### ターゲットユーザー

1. **地元スポーツファン**: 栃木県在住で、地元チームを応援したい方
2. **スポーツ観戦初心者**: 「スポーツ観戦に行ってみたい」と思っている方
3. **複数競技ファン**: 複数のスポーツに興味があり、情報をまとめてチェックしたい方
4. **県外ファン**: 栃木県外から栃木のスポーツに興味を持った方

### 提供価値

- **情報の一元化**: 6チームの情報を1サイトで完結
- **選手の人柄を知る**: エピソードで選手の個性や魅力を伝える
- **観戦のハードルを下げる**: 初心者向けガイドで安心して観戦デビュー
- **地域スポーツの活性化**: 地元チームの認知度向上と応援文化の醸成

## 対象チーム

1. **宇都宮ブレックス** (バスケットボール - B.LEAGUE B1)
2. **栃木SC** (サッカー - J2リーグ)
3. **H.C.栃木日光アイスバックス** (アイスホッケー - アジアリーグ)
4. **宇都宮ブリッツェン** (サイクルロードレース - Jプロツアー)
5. **栃木ゴールデンブレーブス** (野球 - BCリーグ)
6. **栃木シティフットボールクラブ** (サッカー - J3リーグ)

## 主な機能

### 公開サイト
- **ヒーロースライダー**: 3つの自動ローテーションスライド（エネルギッシュな背景画像）
- **チーム一覧**: 6チームのカード表示とクイックリンク
- **試合スケジュール**: 今後の試合情報（17試合）
- **注目選手セクション**: 12名の注目選手を表示（プロフィール・エピソード付き）
- **選手情報**: 全24名の選手プロフィール
- **観戦ガイド**: スポーツ別の観戦ガイド記事（5記事）
- **レスポンシブデザイン**: モバイル・タブレット・デスクトップ対応（ハンバーガーメニュー）
- **SEO最適化**: メタタグ、OGP、JSON-LD構造化データ、robots.txt、sitemap.xml完備

### 管理画面（CMS）
- **ダッシュボード**: データ統計表示
- **チーム管理**: チーム情報の一覧表示
- **試合管理**: 試合の追加・編集・削除（CRUD完備）
- **選手管理**: 選手の追加・編集・削除（CRUD完備、画像プレビュー・エピソード入力機能付き）
- **記事管理**: 観戦ガイド記事の追加・編集・削除（CRUD完備）
- **Basic認証**: admin/tochigi2025

## 技術スタック

### フロントエンド
- **HTML5 + JavaScript** (Vanilla JS)
- **Tailwind CSS** (CDN)
- **Font Awesome** (アイコン)
- **Axios** (HTTP クライアント)
- **Day.js** (日付処理)

### バックエンド
- **Hono** (軽量Webフレームワーク)
- **TypeScript**
- **Cloudflare Workers** (エッジランタイム)
- **Cloudflare D1** (SQLiteベース分散DB)

### 開発ツール
- **Vite** (ビルドツール)
- **Wrangler** (Cloudflare CLI)
- **PM2** (プロセス管理)

## データモデル

### データベーステーブル
1. **teams** - チーム情報（6件）
2. **venues** - 会場情報（8件）
3. **matches** - 試合情報（17件）
4. **players** - 選手情報（24件、episodeフィールド含む）
5. **guide_articles** - 観戦ガイド記事（5件）
6. **local_spots** - 周辺スポット情報

### 選手データ構造
- **基本情報**: name, uniform_number, position, height, weight, birthdate, hometown
- **画像**: photo_url（URL形式）
- **プロフィール**: bio（経歴・実績・プレースタイル）
- **エピソード**: episode（人柄・性格・習慣など個性が伝わるストーリー）
- **注目フラグ**: is_featured（注目選手として表示）

### 主要データ
- **チーム**: 6チーム
- **試合**: 17試合
- **選手**: 24名（各チーム4名、12名が注目選手）
- **記事**: 5記事（スポーツ別観戦ガイド）
- **会場**: 8会場

## セットアップ

### 前提条件
- Node.js 18+
- npm または pnpm

### インストール
```bash
npm install
```

### ローカル開発
```bash
# データベースマイグレーション適用
npm run db:migrate:local

# ビルド
npm run build

# 開発サーバー起動（PM2使用）
pm2 start ecosystem.config.cjs

# サーバー確認
curl http://localhost:3000
```

### データベース操作
```bash
# ローカルマイグレーション適用
npm run db:migrate:local

# シードデータ投入
npm run db:seed

# データベースリセット
npm run db:reset

# ローカルDBコンソール
npm run db:console:local
```

## デプロイ

### Cloudflare Pages へのデプロイ
```bash
# ビルド
npm run build

# Cloudflare Pages プロジェクト作成
npx wrangler pages project create webapp \
  --production-branch main \
  --compatibility-date 2024-01-01

# デプロイ
npm run deploy:prod
```

### 本番環境マイグレーション
```bash
npm run db:migrate:prod
```

## URL

### 開発環境
- **公開サイト**: http://localhost:3000
- **管理画面**: http://localhost:3000/admin
  - ユーザー名: `admin`
  - パスワード: `tochigi2025`

### 本番環境
- **公開サイト**: https://webapp.pages.dev
- **管理画面**: https://webapp.pages.dev/admin

## プロジェクト構成

```
webapp/
├── src/
│   ├── index.tsx          # Honoメインアプリケーション
│   └── types.ts           # TypeScript型定義
├── public/
│   └── static/
│       ├── app.js         # 公開サイトJS
│       ├── admin.js       # 管理画面JS
│       └── style.css      # カスタムCSS
├── migrations/
│   ├── 0001_initial_schema.sql
│   ├── 0002_seed_data.sql
│   ├── 0003_add_player_features.sql
│   ├── 0004_add_home_venue_to_teams.sql
│   ├── 0005_add_icon_and_description_to_guide_articles.sql
│   ├── 0006_add_match_seed_data.sql
│   ├── 0007_add_player_seed_data.sql
│   └── 0008_add_episode_to_players.sql
├── ecosystem.config.cjs   # PM2設定
├── wrangler.jsonc         # Cloudflare設定
├── package.json
├── tsconfig.json
└── README.md
```

## API エンドポイント

### 公開API
- `GET /api/teams` - チーム一覧
- `GET /api/teams/:id` - チーム詳細
- `GET /api/matches` - 試合一覧
- `GET /api/players` - 選手一覧
- `GET /api/venues` - 会場一覧
- `GET /api/guides` - 観戦ガイド記事一覧
- `GET /api/guides/:slug` - 記事詳細
- `GET /api/local-spots` - 周辺スポット一覧

### 管理API（Basic認証必須）
- `POST /api/admin/matches` - 試合追加
- `PUT /api/admin/matches/:id` - 試合更新
- `DELETE /api/admin/matches/:id` - 試合削除
- `POST /api/admin/players` - 選手追加
- `PUT /api/admin/players/:id` - 選手更新
- `DELETE /api/admin/players/:id` - 選手削除
- `POST /api/admin/guides` - 記事追加
- `PUT /api/admin/guides/:id` - 記事更新
- `DELETE /api/admin/guides/:id` - 記事削除

## 開発フロー

### 新しい機能の追加
1. マイグレーションファイル作成（必要な場合）
2. バックエンドAPIエンドポイント追加（src/index.tsx）
3. フロントエンド実装（public/static/app.js または admin.js）
4. テスト
5. Gitコミット

### トラブルシューティング
```bash
# ポート3000が使用中の場合
fuser -k 3000/tcp 2>/dev/null || true

# PM2プロセス確認
pm2 list

# PM2ログ確認
pm2 logs webapp --nostream

# データベースリセット
npm run db:reset
```

## ライセンス

このプロジェクトは私的利用を目的としています。

## 更新履歴

- **2025-11-01**: プロジェクト再構築完了
- **2025-11-01**: 試合・選手管理のCRUD機能追加
- **2025-11-01**: 試合データ（17件）と選手データ（24名）のシード投入完了
- **2025-11-01**: SEO最適化実施（メタタグ、OGP、構造化データ、robots.txt、sitemap.xml）
- **2025-11-01**: モバイルメニュー追加、ヒーロー背景画像更新、注目選手セクション追加
- **2025-11-01**: ヘッダーデザイン刷新（黒背景・大きなロゴ・黄色アクセント）
- **2025-11-01**: 選手管理モーダル改善（エピソードフィールド追加、画像プレビュー機能追加）

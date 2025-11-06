# 🚀 デプロイガイド

## 概要
- **フロントエンド**: Vercel (Next.js)
- **バックエンド**: Render (Go + PostgreSQL)

## 🎯 デプロイ手順

### 1. GitHubリポジトリ準備
```bash
git add .
git commit -m "Add deployment configuration"
git push origin main
```

### 2. バックエンドデプロイ（Render）

#### PostgreSQLデータベース作成
1. [Render Dashboard](https://dashboard.render.com) → **New** → **PostgreSQL**
2. 設定:
   - **Name**: `shopmarket-db`
   - **Database**: `shopmarket`
   - **User**: `shopmarket_user`
   - **Plan**: `Free`

#### Webサービス作成
1. **New** → **Web Service**
2. GitHubリポジトリを選択
3. 設定:
   - **Name**: `shopmarket-backend`
   - **Environment**: `Docker`
   - **Dockerfile Path**: `backend/Dockerfile`
   - **Plan**: `Free`

#### 環境変数設定
```
ENV=prod
PORT=8080
GIN_MODE=release
JWT_SECRET=[自動生成またはランダム文字列]
DB_HOST=[データベースのInternal Database URL]
DB_PORT=5432
DB_NAME=shopmarket
DB_USER=shopmarket_user
DB_PASSWORD=[データベースのパスワード]
ALLOWED_ORIGINS=https://your-app.vercel.app
```

### 3. フロントエンドデプロイ（Vercel）

#### プロジェクト作成
1. [Vercel Dashboard](https://vercel.com/dashboard) → **New Project**
2. GitHubリポジトリを選択
3. 設定:
   - **Framework Preset**: `Next.js`
   - **Root Directory**: `frontend`

#### 環境変数設定
```
NEXT_PUBLIC_API_URL=https://shopmarket-backend.onrender.com
```

## 🔧 デプロイ後の設定

### 1. CORS設定更新
バックエンドの環境変数 `ALLOWED_ORIGINS` にVercelのURLを設定:
```
ALLOWED_ORIGINS=https://your-actual-vercel-url.vercel.app
```

### 2. データベースマイグレーション
Renderのコンソールから実行:
```bash
# Renderのシェルで実行
./main
```

## 🧪 動作確認

### API確認
```
https://shopmarket-backend.onrender.com/items
```

### フロントエンド確認
```
https://your-app.vercel.app
```

## 💰 料金

### Render
- **Free Plan**: 月750時間まで無料
- データベース: 無料（1GB制限）

### Vercel  
- **Hobby Plan**: 無料（個人利用）

## 🔍 トラブルシューティング

### よくある問題
1. **CORS エラー**: `ALLOWED_ORIGINS` の設定を確認
2. **API接続エラー**: `NEXT_PUBLIC_API_URL` の設定を確認
3. **データベース接続エラー**: データベースの環境変数を確認

### ログ確認
- **Render**: Dashboard → Service → Logs
- **Vercel**: Dashboard → Project → Functions

## 📝 注意事項

- 無料プランでは30分間アクセスがないとスリープします
- 初回アクセス時は起動に時間がかかる場合があります
- 本番環境では必ず強力なJWT_SECRETを設定してください

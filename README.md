# ShopMarket

ECサイト風のアイテム管理システムです（アイデアベースなのでmercariなどに比べると著しく性能などは下がります(笑)）。Go（Gin）バックエンドとNext.jsフロントエンドで構成してます。

## アーキテクチャ

```
shopmarket/
├── backend/          # Go (Gin) API サーバー
└── frontend/         # Next.js アプリケーション
```

## 技術スタック

### バックエンド
- **Go 1.21+**
- **Gin** - Webフレームワーク
- **GORM** - ORM
- **PostgreSQL** - データベース
- **JWT** - 認証
- **Docker** - コンテナ化

### フロントエンド
- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui** - UIコンポーネント
- **React Hook Form** - フォーム管理
- **Zod** - バリデーション
- **Axios** - HTTP クライアント
- **TanStack Query** - 状態管理・キャッシュ

## 機能

### 認証機能
- ユーザー登録
- ログイン（JWT認証）
- 認証ミドルウェア

### アイテム管理
- アイテム一覧表示（全ユーザー）
- アイテム詳細表示（認証必要）
- アイテム作成（認証必要）
- アイテム更新（所有者のみ）
- アイテム削除（所有者のみ）

## API エンドポイント

### 認証
- `POST /auth/signup` - ユーザー登録
- `POST /auth/login` - ログイン

### アイテム
- `GET /items` - 全アイテム取得（認証不要）
- `GET /items/:id` - 特定アイテム取得（認証必要）
- `POST /items` - アイテム作成（認証必要）
- `PUT /items/:id` - アイテム更新（認証必要）
- `DELETE /items/:id` - アイテム削除（認証必要）

## データモデル

### User
```go
type User struct {
    gorm.Model
    Email    string `gorm:"not null;unique"`
    Password string `gorm:"not null"`
    Items    []Item `gorm:"constraint:OnDelete:CASCADE"`
}
```

### Item
```go
type Item struct {
    gorm.Model
    Name        string `gorm:"not null"`
    Price       uint   `gorm:"not null"`
    Description string
    SoldOut     bool   `gorm:"not null;default false"`
    UserID      uint   `gorm:"not null"`
}
```

## 🛠️ セットアップ

### 前提条件
- Go 1.21+
- Docker & Docker Compose
- Node.js 18+ (フロントエンド用)
- pnpm (フロントエンド用)

### バックエンドセットアップ

1. **リポジトリクローン**
```bash
git clone <repository-url>
cd shopmarket
```

2. **依存関係インストール**
```bash
go mod download
```

3. **データベース起動**
```bash
docker-compose up -d db
```

4. **環境変数設定**
```bash
cp .env.example .env
# .envファイルを編集してデータベース接続情報を設定
```

5. **サーバー起動**
```bash
go run main.go
```

サーバーは `http://localhost:8080` で起動します。

### フロントエンドセットアップ

1. **フロントエンドディレクトリに移動**
```bash
cd frontend
```

2. **依存関係インストール**
```bash
pnpm install
```

3. **開発サーバー起動**
```bash
pnpm dev
```

フロントエンドは `http://localhost:3000` で起動します。（3001でも3002等でも大丈夫です）

## テスト

### バックエンドテスト
```bash
go test ./...
```

### 特定のテスト実行
```bash
go test -v ./controllers
```

##プロジェクト構造
### 構造（フルスタック）
```
shopmarket/
├── backend/         
│   ├── controllers/
│   ├── services/
│   ├── repositories/
│   ├── models/
│   ├── dto/
│   ├── middlewares/
│   ├── infra/
│   ├── migrations/
│   └── main.go
├── frontend/        
│   ├── src/
│   │   ├── app/     
│   │   ├── components/
│   │   ├── lib/
│   │   ├── types/
│   │   └── hooks/
│   ├── package.json
│   └── next.config.js
└── docker-compose.yaml
```

##API使用例

### ユーザー登録
```bash
curl -X POST http://localhost:8080/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### ログイン
```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### アイテム作成（認証必要）
```bash
curl -X POST http://localhost:8080/items \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-jwt-token>" \
  -d '{
    "name": "商品名",
    "price": 1000,
    "description": "商品説明"
  }'
```





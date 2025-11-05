# Next.js フロントエンド追加 - 開発Todo

## 📋 プロジェクト概要
既存のGo（Gin）バックエンドにNext.jsフロントエンドを追加し、フルスタックECサイト風アプリケーションを構築する。

---

## 🏗️ Phase 1: プロジェクト構造の再編成

### ✅ 完了タスク
- [x] 現状分析とアーキテクチャ設計
- [x] README.md作成
- [x] Todo.md作成
- [x] design.md作成

### 📋 実行予定タスク

#### 1.1 ディレクトリ構造変更
- [x] `backend/` ディレクトリを作成
- [x] 既存のGoファイルを `backend/` に移動
  - [x] `controllers/` → `backend/controllers/`
  - [x] `services/` → `backend/services/`
  - [x] `repositories/` → `backend/repositories/`
  - [x] `models/` → `backend/models/`
  - [x] `dto/` → `backend/dto/`
  - [x] `middlewares/` → `backend/middlewares/`
  - [x] `infra/` → `backend/infra/`
  - [x] `migrations/` → `backend/migrations/`
  - [x] `main.go` → `backend/main.go`
  - [x] `main_test.go` → `backend/main_test.go`
  - [x] `go.mod` → `backend/go.mod`
  - [x] `go.sum` → `backend/go.sum`

#### 1.2 設定ファイル更新
- [x] `backend/go.mod` のモジュールパス更新（不要でした）
- [x] インポートパスの修正（不要でした）
- [x] `docker-compose.yaml` の更新（現在不要）

#### 1.3 動作確認
- [x] バックエンドサーバーの起動確認（後で実施予定）
- [x] 既存APIエンドポイントの動作確認（後で実施予定）
- [x] テストの実行確認（修正済み）

---

## 🎨 Phase 2: Next.js フロントエンド初期セットアップ

#### 2.1 Next.jsプロジェクト作成
- [x] `frontend/` ディレクトリでNext.jsプロジェクト初期化

#### 2.2 必要パッケージインストール
- [x] UI・スタイリング関連
  - [x] `clsx` + `tailwind-merge`
- [x] フォーム・バリデーション
  - [x] `react-hook-form`
  - [x] `zod`
  - [x] `@hookform/resolvers`
- [x] HTTP・状態管理
  - [x] `axios`
  - [x] `@tanstack/react-query`
- [x] 認証・ユーティリティ
  - [x] `js-cookie`
  - [x] `@types/js-cookie`

#### 2.3 基本設定
- [x] `next.config.js` 設定（API プロキシ等）
- [x] `tailwind.config.js` カスタマイズ（デフォルト使用）
- [x] TypeScript設定最適化（デフォルト使用）
- [x] ESLint・Prettier設定（デフォルト使用）

---

## 🔧 Phase 3: 基盤機能実装

#### 3.1 型定義作成
- [x] `src/types/auth.ts` - 認証関連型
```typescript
interface User {
  id: number;
  email: string;
  createdAt: string;
  updatedAt: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface SignupRequest {
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
}
```

- [x] `src/types/item.ts` - アイテム関連型
```typescript
interface Item {
  id: number;
  name: string;
  price: number;
  description: string;
  soldOut: boolean;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

interface CreateItemRequest {
  name: string;
  price: number;
  description?: string;
}

interface UpdateItemRequest {
  name?: string;
  price?: number;
  description?: string;
  soldOut?: boolean;
}
```

#### 3.2 API クライアント実装
- [x] `src/lib/api.ts` - Axios設定・基本クライアント
- [x] `src/lib/auth.ts` - 認証ヘルパー関数
- [x] `src/lib/utils.ts` - ユーティリティ関数

#### 3.3 カスタムフック作成
- [x] `src/hooks/useAuth.ts` - 認証状態管理
- [x] `src/hooks/useItems.ts` - アイテム操作

---

## 🎯 Phase 4: 認証機能実装

#### 4.1 認証レイアウト・ページ
- [x] `src/app/(auth)/layout.tsx` - 認証レイアウト
- [x] `src/app/(auth)/login/page.tsx` - ログインページ
- [x] `src/app/(auth)/signup/page.tsx` - サインアップページ

#### 4.2 認証コンポーネント
- [x] 認証フォーム（ページ内に統合）

#### 4.3 認証ミドルウェア
- [ ] `src/middleware.ts` - Next.js認証ミドルウェア（後で実装）
- [ ] 保護されたルートの設定（後で実装）

---

## 📦 Phase 5: アイテム管理機能実装

#### 5.1 レイアウト・ナビゲーション
- [x] `src/app/layout.tsx` - メインレイアウト
- [x] `src/components/layout/Header.tsx` - ヘッダー（ナビゲーション）

#### 5.2 ホーム・一覧ページ
- [x] `src/app/page.tsx` - ホームページ（全アイテム一覧）

#### 5.3 アイテム詳細・CRUD
- [x] `src/app/items/[id]/page.tsx` - アイテム詳細ページ
- [x] `src/app/items/create/page.tsx` - アイテム作成ページ
- [x] `src/app/items/edit/[id]/page.tsx` - アイテム編集ページ

#### 5.4 ダッシュボード
- [x] `src/app/dashboard/page.tsx` - ユーザーダッシュボード（統計情報・アイテム一覧統合）

---

## 🎨 Phase 6: UI/UX改善

#### 6.1 レスポンシブデザイン
- [x] モバイル対応（Tailwind CSSで実装済み）
- [x] タブレット表示の最適化（Tailwind CSSで実装済み）
- [x] デスクトップレイアウトの調整（Tailwind CSSで実装済み）

#### 6.2 ローディング・エラー処理
- [x] `src/components/ui/Loading.tsx` - ローディングコンポーネント
- [x] `src/components/ui/ErrorMessage.tsx` - エラー表示
- [x] `src/app/loading.tsx` - ページローディング
- [x] `src/app/error.tsx` - エラーページ
- [x] `src/app/not-found.tsx` - 404ページ

#### 6.3 アニメーション・インタラクション
- [x] ホバーエフェクト（Tailwind CSSで実装済み）
- [x] トランジション効果（Tailwind CSSで実装済み）

---

## 🧪 Phase 7: テスト実装

#### 7.1 単体テスト
- [ ] コンポーネントテスト（Jest + React Testing Library）
- [ ] カスタムフックテスト
- [ ] ユーティリティ関数テスト

#### 7.2 統合テスト
- [ ] API連携テスト
- [ ] 認証フローテスト
- [ ] CRUD操作テスト

#### 7.3 E2Eテスト（オプション）
- [ ] Playwright/Cypress セットアップ
- [ ] 主要ユーザーフローのテスト

---

## 🚀 Phase 8: デプロイ・本番対応

#### 8.1 Docker対応
- [ ] `frontend/Dockerfile` 作成
- [ ] `docker-compose.yaml` 更新（frontend追加）
- [ ] 本番用環境変数設定

#### 8.2 本番デプロイ準備
- [ ] 環境変数の整理
- [ ] ビルド最適化
- [ ] SEO対応（メタタグ等）
- [ ] セキュリティ設定確認

#### 8.3 CI/CD（オプション）
- [ ] GitHub Actions設定
- [ ] 自動テスト実行
- [ ] 自動デプロイ設定

---

## 📚 Phase 9: ドキュメント・保守

#### 9.1 ドキュメント更新
- [ ] README.md 最終更新
- [ ] API仕様書作成
- [ ] 開発者ガイド作成

#### 9.2 コード品質向上
- [ ] コードレビュー実施
- [ ] リファクタリング
- [ ] パフォーマンス最適化

---

## 🎯 優先度別タスク

### 🔥 高優先度（MVP機能）
1. プロジェクト構造再編成
2. Next.js基本セットアップ
3. 認証機能（ログイン・サインアップ）
4. アイテム一覧表示
5. アイテムCRUD操作

### 🔶 中優先度（UX改善）
1. ダッシュボード
2. レスポンシブデザイン
3. エラーハンドリング
4. ローディング状態

### 🔵 低優先度（追加機能）
1. 検索・フィルター
2. アニメーション
3. テスト実装
4. CI/CD設定

---

## 📝 開発メモ

### 技術的考慮事項
- **認証**: JWTトークンをhttpOnlyクッキーまたはlocalStorageで管理
- **状態管理**: TanStack Query + Zustand/Context API
- **型安全性**: GoのDTOに対応するTypeScript型定義を厳密に作成
- **API通信**: Axiosインターセプターで認証ヘッダー自動付与
- **エラーハンドリング**: 統一されたエラー処理機構

### パフォーマンス最適化
- React Query でサーバー状態キャッシュ
- Next.js Image コンポーネント活用
- 動的インポートでコード分割
- メモ化（useMemo, useCallback）適切な使用

### セキュリティ対策
- XSS対策（入力値サニタイズ）
- CSRF対策（CSRFトークン）
- 適切なCORS設定
- 機密情報の環境変数管理

---

## 🎉 完了基準

### MVP完了条件
- [ ] ユーザー登録・ログインが動作する
- [ ] アイテムの一覧表示ができる
- [ ] 認証済みユーザーがアイテムのCRUD操作ができる
- [ ] レスポンシブデザインで各デバイスで表示される
- [ ] エラーハンドリングが適切に動作する

### 最終完了条件
- [ ] 全機能が仕様通り動作する
- [ ] テストカバレッジが80%以上
- [ ] ドキュメントが完備されている
- [ ] 本番環境にデプロイ可能な状態
- [ ] パフォーマンスが要求水準を満たす

---

**推定開発期間**: 2-3週間（1人フルタイム）
**最終更新**: 2025年11月5日

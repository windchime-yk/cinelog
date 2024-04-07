# CineLog
`CineLog === Cinema Log`  
私が映画館で今まで観た映画を載せた個人サイト。  
取得データは、自分のGoogleカレンダーに記載されていた2016年9月〜現在まで。

## 必要なもの
- Denoの最新版
- TiDB Cloudのアカウント情報

## データ構造
### シーケンス図
#### 共通ヘッダー
``` mermaid
sequenceDiagram
  participant app as シネログ
  participant cookie as Cookie

  alt 初期表示
    app ->> cookie : ログイン情報を取得
    cookie -->> app : ログイン情報ないしundefinedを返却
  end
```

#### TOP画面
``` mermaid
sequenceDiagram
  participant toppage as TOP画面
  participant searchpage as 検索画面
  participant cookie as Cookie
  participant db as TiDB Cloud

  alt 初期表示
    alt 鑑賞作品データ取得
      toppage ->> db : 上映日を基準に降順に並び替え、データ10件リクエスト
      db -->> toppage : データ返却
    end
  end

  alt 検索時
    toppage ->> searchpage : searchパラメータを保持して遷移
  end
```

#### 鑑賞作品一覧画面
``` mermaid
sequenceDiagram
  participant app as 鑑賞作品一覧画面
  participant db as TiDB Cloud

  alt 初期表示
    alt 鑑賞作品データ取得
      app ->> db : 全件データリクエスト
      db -->> app : 全件データ返却
    end
  end
```

#### 検索画面
``` mermaid
sequenceDiagram
  participant app as 検索画面
  participant db as TiDB Cloud

  alt 初期表示
    alt 鑑賞作品データ取得
      app ->> db : 全件データリクエスト
      db -->> app : 全件データ返却
    end
  end

  alt 検索時
    app ->> app : searchパラメータを保持して遷移
    app ->> db : パラメータを検索条件にデータリクエスト
    db -->> app : 検索条件に合致するデータを返却
  end
```

#### ログイン画面
```mermaid
sequenceDiagram
  participant loginpage as ログイン画面
  participant toppage as TOP画面
  participant redirect as 認証画面
  participant cookie as Cookie

  alt ログイン時
    loginpage ->> redirect : usernameパラメータとpasswordパラメータを保持して遷移
    alt 環境変数と照合して正規のログイン情報だった場合
      redirect -->> toppage : Cookie情報を保持してリダイレクト
      toppage ->> cookie : ログイン情報を保存
    end
    alt 正規のログイン情報ではなかった場合 
      redirect ->> toppage : リダイレクト
    end
  end
```

#### ダッシュボード画面
```mermaid
sequenceDiagram
  participant dashboardpage as ダッシュボード画面
  participant loginpage as ログイン画面
  participant redirect as データ追加画面
  participant toppage as TOP画面
  participant cookie as Cookie
  participant db as TiDB Cloud
  
  alt 初期表示
    dashboardpage ->> cookie : ログイン情報を取得
    cookie -->> dashboardpage : ログイン情報を返却
    alt ログイン情報が不正な場合
      dashboardpage ->> loginpage : ログイン画面にリダイレクト
    end
  end
  
  alt 鑑賞作品データ追加
    dashboardpage ->> redirect : フォームデータをパラメータに保持して遷移
    redirect ->> cookie : ログイン情報の取得
    cookie -->> redirect : ログイン情報の返却
    alt ログイン情報が正しい場合
      redirect ->> db : 鑑賞作品データを追加
    end
    redirect ->> toppage : TOP画面にリダイレクト
  end

  alt 映画館データ追加
    dashboardpage ->> redirect : フォームデータをパラメータに保持して遷移
    redirect ->> cookie : ログイン情報の取得
    cookie -->> redirect : ログイン情報の返却
    alt ログイン情報が正しい場合
      redirect ->> db : 映画館データを追加
    end
    redirect ->> toppage : TOP画面にリダイレクト
  end
```

# CineLog
`CineLog === Cinema Log`  
私が映画館で今まで観た映画を載せた個人サイト。  
取得データは、自分のGoogleカレンダーに記載されていた2016年9月〜現在まで。  
データベースの準備が整うまでは`assets/test.json`を仮置きしている。

## 必要なもの
- Denoの最新版
- SurrealDBの最新版

## データ構造
### シーケンス図
理想としている流れ

```mermaid
sequenceDiagram
  participant app as シネログ
  participant cache as Local Storage
  participant db as SurrealDB

  alt 初期表示
    app ->> cache : Local Storageにデータがあるか確認
    cache -->> app : データを返却
    app ->> app : ローカルキャッシュの有効期限を確認
    alt ローカルキャッシュがないか有効期限切れの場合
      app ->> db : 全件データリクエスト
      db -->> app : 全件データ返却
      app ->> cache : Local Storageに保存
    end
  end

  alt 検索時
    app ->> cache : Local Storageからデータ取得
    cache -->> app : データ返却
  end

  alt 新規追加時
    app ->> db : 新規データPOSTリクエスト
    db -->> app : リクエスト完了通知
    app ->> cache : Local Storageに保存
  end
```

### ER図
主キーはidで、`AUTO_INCREMENT`を適用。  
映画を観に行くときに同伴者がいることが稀なので、現状はmovieテーブルのみを作成し利用する

```mermaid
erDiagram

movie ||--o{ accompanier: ""

%% 鑑賞作品テーブル
movie {
  INT id
  VARCHAR title
  BOOLEAN is_dubbed
  BOOLEAN is_domestic
  BOOLEAN is_live_action
  VARCHAR theater
  VARCHAR view_date
  VARCHAR view_start_time
  VARCHAR view_end_time
  INT rating
  TEXT comment
}

%% 同伴者テーブル
accompanier {
  INT id
  VARCHAR type
}

```
https://www.delftstack.com/ja/howto/mysql/store-array-in-mysql/


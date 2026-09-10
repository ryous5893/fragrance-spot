# Fragrance Spot ｜ 香り診断

かわせみ祭 × 高崎モントレー（3F・4F）の香水自動販売機体験用サイト
4つの問いに答えると 8つの型から あなたに似合う一本を提案する

**本番はiPad**（タッチ操作前提で最適化済み）

---

## ファイル構成

| ファイル | 役割 |
|---|---|
| `fragrance-spot.html` | **編集するのはこれ**。`assets/w/*.webp` を参照する開発版 |
| `fragrance-spot-standalone.html` | 配布用。画像をdata URIで埋め込んだ単一ファイル。**直接編集しない**（生成物） |
| `build-standalone.py` | 開発版 → 配布版を生成するスクリプト |
| `assets/w/*.webp` | サイトが使う最適化済み画像（これだけリポジトリに含む） |

---

## 動かす

```bash
python3 -m http.server 8000
# → http://localhost:8000/fragrance-spot.html
```

`fragrance-spot-standalone.html` は単体で開けばどこでも動く（サーバー不要）

## PWA として公開する

`fragrance-spot.html` は PWA 対応済み。HTTPS で静的ホスティングすると、Safari / Chrome からホーム画面に追加でき、初回アクセス後はオフラインでも利用できる。

- 公開時はリポジトリのルートごとアップロードする（`assets/`、`icons/`、`manifest.webmanifest`、`sw.js` を含める）
- URL は `https://公開先/` を案内する（`index.html` から診断ページへ遷移する）
- GitHub Pages などサブディレクトリ配下の公開にも対応するため、パスはすべて相対指定
- Service Worker の動作には HTTPS（または `localhost`）が必要。`file://` で開いた場合は通常の HTML として動作する
- サイト更新時は `sw.js` の `CACHE_NAME` を更新する。利用者は次回アクセス時に新しいキャッシュへ切り替わる

## 配布版を作り直す

`fragrance-spot.html` を編集したら必ず実行する

```bash
python3 build-standalone.py
```

---

## 内容の差し替え

`fragrance-spot.html` 内の `const CONFIG = {...}` だけ編集すればよい HTML/CSSは触らなくてよい

- `scents` … 香り5種（名称 説明 ノート タグ アクセント色 `art`）
  - `art.flacon` … 結果画面の瓶の画像
  - `art.bots` … 左右に配置する素材の画像2点
  - `art.bg` … その香りの背景
- `codeMap` … 診断コード `AAA`〜`BBB` → どの香りを出すか
- `prices` `payment` `location` `howto`

質問は `const QUESTIONS = [...]`
各選択肢の `img` がその選択肢のビジュアル

---

## 診断ロジック

- Q1〜Q3 の A/B で 8つの型（`AAA`〜`BBB`）を判定
- 8つの型を 5種の香りに割り当て（`codeMap`）
- Q4「印象」は結果のタグと一文に反映
- `runDiagnosisTests()` をブラウザのコンソールで実行すると整合性を検査できる

---

## 決まっていること / 決まっていないこと

**確定**
- 価格 150円 / 300円 / 500円
- 設置 高崎モントレー 3F・4F
- 試香は **肌につけず 小瓶に入れた香り付きコットン**で行う（試香紙ではない）
- アンケートとQRは **やらない**（実装から削除済み）

**未確定**
- 決済方法（`CONFIG.payment` が仮の文言）

---

## 表記のルール

- **句読点（、。）を使わない** 区切りは半角スペースか改行
- 日本語が変な位置で折り返さないよう `word-break:auto-phrase` 等を指定済み
  長い文を足すときは `<br>` で明示的に改行位置を決めること

---

## 素材について

- サイトが使う画像は `assets/w/*.webp` のみ（リポジトリに含む）
- 元データ（`assets/raw-*.png` `assets/cut-*.png` 合計250MB超）は**ローカルのみ** 必要なら作成者から受け取ること
- 画像は生成したオリジナル 実在ブランドの製品写真は**使っていない**
  （公式画像の転載は著作権侵害になるため 実物を見せたい場合は自分で撮影すること）
- 切り抜きは「白背景を境界から連結成分で除去」する方式 白い被写体も削れない

---

## 注意

香り選びを楽しむための簡易的な診断であり 医学的な診断ではない
香り 価格 設置場所 決済方法は変更になる場合がある

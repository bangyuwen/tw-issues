# TW Issues

台灣議題脈絡：公開證據、事件進展與各方說法的可查閱讀入口。

TW Issues 是一個以 source-backed public bundle 驅動的公開閱讀網站。網站把已確認資訊、具名說法、TW Issues 的分析或主張、仍待釐清的問題、事件進展與原始來源分開呈現；它不是私有研究資料庫，也不會在建置時讀取私有研究路徑。

## Quick start

需要 Node.js `>=22.13.0`。

```bash
npm ci
npm test
npm run lint
npm run build
```

`npm test` 會先驗證 `public-bundle.json` 的 schema、檔案 digest、議題 inventory 與公開邊界，再執行 rendered-page tests。

## Public bundle

網站只消費以下公開輸入：

- `public-bundle.json`：`tw-issues-public-bundle/v1` manifest、公開檔案 digest 與議題 provenance。
- `app/public-evidence.json`：allowlisted public evidence projection。
- `app/research-topics.json`：公開議題索引。

每個來源仍受自己的授權與使用條件約束；`license_policy: source-specific` 不代表第三方來源文字取得共同授權。請保留 canonical URL、publisher、日期與來源角色。

## Repository boundary

公開網站的建置、測試與 lint 不需要私有研究倉庫、evidence ledger、帳號資料、研究筆記、部署 project ID 或 secrets。公開資料只能透過已驗證的單向 bundle 進入網站；不要把私有 ledger、內部 claim/source ID 或 production readback metadata 放入這個專案。

## Development notes

- `app/`：TW Issues index、topic pages、shared evidence rendering。
- `tests/`：bundle verification 與 rendered contract tests。
- `public/`：公開網站資產。
- `build/`、`worker/`：Vinext／Cloudflare runtime integration。
- `tests/`：公開 bundle 邊界與 rendered-page contract tests。

部署供應商設定應以未追蹤的本機檔案或供應商 secret 注入；不要提交 user-owned project identifiers。

# TW Issues

## 公開網站邊界

這個目錄是 `TW Issues` 公開閱讀網站的 source tree。它只消費 `public-bundle.json`、`app/public-evidence.json` 與 `app/research-topics.json`；不得讀取私有研究倉庫、evidence ledger、`context/`、`account/`、`.claude/` 或部署 project ID。

公開頁面只呈現可回查的事實、具名說法、清楚標記的 TW Issues 分析／主張、仍待釐清的問題、事件進展與來源限制。來源的單方說法只能證明「此人曾如此表示」，不得因職位、知名度或媒體篇數升格為已確認事實。

不得在前端推測缺失的來源、補寫不存在的因果、把 attributed／analysis／stance 變成 verified，或以來源數量暗示完整性與可信度。所有可公開 claim 都必須保留 proof scope、limitations 與 canonical source link。

## 開發與驗證

在修改頁面或 bundle contract 後，至少執行：

```bash
npm test
npm run lint
npm run build
```

Python 產製器與公開化閘門屬於私有 producer，不應複製進這個 source tree。公開 repo 的 CI 必須能在沒有私有 secrets 與 parent checkout 的情況下完成。

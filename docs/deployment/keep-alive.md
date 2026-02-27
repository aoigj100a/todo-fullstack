# Keep-Alive 機制說明

Render 免費方案在服務**閒置 15 分鐘**後會自動 spin down，導致下次請求需要 30-60 秒冷啟動時間。
本專案採用雙重策略維持後端存活。

---

## 策略一：前端自動 Ping（已實作）

**原理**：使用者開著網頁時，前端每 10 分鐘自動呼叫一次 health check。

**相關檔案**：

- Hook：`apps/frontend/src/hooks/useKeepAlive.ts`
- 掛載點：`apps/frontend/src/components/ClientProviders.tsx`（透過 `<KeepAlive />` 組件）

**Ping 端點**：`GET /api/health`（由 `NEXT_PUBLIC_API_URL` 環境變數決定）

**限制**：只在用戶開著網頁時有效。若無任何用戶使用，15 分鐘後仍會 spin down。

---

## 策略二：cron-job.org 外部排程（推薦手動設定）

**原理**：透過免費的外部 cron 服務，每 10 分鐘自動發送請求，不依賴前端是否開啟。

### 設定步驟

1. 前往 [cron-job.org](https://cron-job.org) 並**免費註冊**帳號

2. 建立新任務（New Cronjob）：
   - **Title**：`Todo Backend Keep-Alive`
   - **URL**：`https://todo-fullstack-backend-rswo.onrender.com/api/health`
   - **Schedule**：每 10 分鐘執行一次
     - 點選 "Every N minutes"，填入 `10`
     - 或使用 Cron Expression：`*/10 * * * *`
   - **Method**：`GET`
   - **Save & Enable**

3. 確認任務狀態為 **Active**，可在 History 查看執行紀錄

### 預期回應

成功時後端回傳：

```json
{
  "status": "ok",
  "timestamp": "2026-02-27T00:00:00.000Z",
  "uptime": 3600
}
```

---

## 總結比較

| 方案                     | 可靠性                | 設定成本               | 適用場景 |
| ------------------------ | --------------------- | ---------------------- | -------- |
| 前端 Ping（已實作）      | 中 — 依賴用戶開著頁面 | 無（已整合）           | 補充方案 |
| cron-job.org（建議設定） | 高 — 不依賴用戶       | 低（免費，5 分鐘設定） | 主要方案 |

**建議**：兩者同時啟用，覆蓋最完整。

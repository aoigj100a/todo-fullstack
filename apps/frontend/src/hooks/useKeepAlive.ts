import { useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
const HEALTH_URL = `${API_URL}/health`;
const PING_INTERVAL_MS = 10 * 60 * 1000; // 10 分鐘，低於 Render 免費方案 15 分鐘的 spin-down 閾值

/**
 * 定期 ping 後端 health check，防止 Render 免費方案因閒置而 spin down。
 * 靜默執行，不影響使用者介面。
 */
export function useKeepAlive() {
  useEffect(() => {
    const ping = () => {
      fetch(HEALTH_URL, { method: 'GET', cache: 'no-store' }).catch(() => {
        // 靜默失敗，keep-alive 是 best-effort
      });
    };

    ping(); // 首次掛載時立即 ping
    const intervalId = setInterval(ping, PING_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, []);
}

import express from 'express';
import errorHandler from '../middlewares/errorHandler';
import requestLogger from '../middlewares/requestLogger';
// 建立 Express 應用程式
const app = express();

// 設定中間件
// 解析 JSON 請求體
app.use(express.json());

// 解析 URL 編碼的請求體
app.use(express.urlencoded({ extended: true }));

// 健康檢查路由 - 直接在根層級設定
app.get('/api/health', (req, res) => {
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  });
  
  // 404 處理
  app.use((req, res, next) => {
    const error: any = new Error('Not Found');
    error.status = 404;
    next(error);
  });
  
  // 錯誤處理中間件
  app.use(errorHandler);

export default app;
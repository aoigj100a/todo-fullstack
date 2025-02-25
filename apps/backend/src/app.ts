import express from 'express';
import cors from 'cors'; // 這行很重要！需要導入 cors 模組
import todoRoutes from './routes/todo.routes';
import authRoutes from './routes/auth.routes';

// 建立 Express 應用程式
const app = express();

// 設定中間件
// 確保這是第一個中間件
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


// 解析 JSON 請求體
app.use(express.json());

// 解析 URL 編碼的請求體
app.use(express.urlencoded({ extended: true }));


// 應用程式路由
app.use('/api/todos', todoRoutes);
app.use('/api/auth', authRoutes);

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
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message,
      status: err.status
    }
  });
});

export default app;

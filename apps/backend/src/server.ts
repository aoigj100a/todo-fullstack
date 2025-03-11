// src/server.ts
import dotenv from 'dotenv';
import app from './app';
import { connectDB } from './configs/database';

// 載入環境變數
dotenv.config();

// 設定伺服器埠號
const PORT = process.env.PORT || 5001;

const startServer = async () => {
  try {
    // 連接資料庫
    await connectDB();

    // 啟動伺服器
    const server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });

    // 優雅關機處理
    const gracefulShutdown = () => {
      console.log('Shutting down server...');
      server.close(async () => {
        // 如果需要在關機時進行額外的清理工作，可以在這裡添加
        console.log('Server closed');
        process.exit(0);
      });
    };

    // 監聽終止信號
    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// 啟動伺服器
startServer();

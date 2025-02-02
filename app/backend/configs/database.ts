// src/config/database.ts
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// 載入環境變數
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/todo-app';

// 連線選項設定
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  autoIndex: true,
  serverSelectionTimeoutMS: 5000, // 超時時間：5秒
  socketTimeoutMS: 45000, // Socket 超時：45秒
};

// 資料庫連線函式
export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // 監聽連線事件
    mongoose.connection.on('connected', () => {
      console.log('Mongoose connected to MongoDB');
    });

    // 監聽錯誤事件
    mongoose.connection.on('error', (err) => {
      console.error('Mongoose connection error:', err);
    });

    // 監聽斷線事件
    mongoose.connection.on('disconnected', () => {
      console.log('Mongoose disconnected from MongoDB');
    });

    // 程式結束時關閉連線
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('Mongoose connection closed through app termination');
      process.exit(0);
    });

    return conn;
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};
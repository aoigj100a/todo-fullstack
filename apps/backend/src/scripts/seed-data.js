// apps/backend/src/scripts/seed-data.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// 載入環境變數
dotenv.config();

// 連接 MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/todo-app')
  .then(() => console.log('MongoDB connected successfully for seeding'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// 定義 Todo Schema (直接在這裡定義，避免路徑問題)
const TodoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [3, 'Title too short'],
      maxlength: [100, 'Title too long'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description too long'],
      default: '',
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'in-progress', 'completed'],
        message: '{VALUE} is not a valid status',
      },
      default: 'pending',
      required: true,
    },
    assignedTo: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// 創建 Todo 模型
const Todo = mongoose.model('Todo', TodoSchema);

// 示範用戶
const demoUser = 'Demo User';

// 預設的 Todo 種子資料
const todoSeedData = [
  {
    title: '完成前端登入頁面',
    description: '實作 JWT 身份驗證並整合到登入表單',
    status: 'completed',
    assignedTo: demoUser,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7天前
  },
  {
    title: '設計 Todo 卡片元件',
    description: '使用 Tailwind CSS 建立響應式卡片設計',
    status: 'completed',
    assignedTo: demoUser,
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000) // 6天前
  },
  {
    title: '實作 Todo CRUD API',
    description: '建立後端 RESTful API 處理 Todo 的增刪改查操作',
    status: 'completed',
    assignedTo: demoUser,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5天前
  },
  {
    title: '整合 React Query',
    description: '在前端使用 React Query 管理 API 請求與資料狀態',
    status: 'in-progress',
    assignedTo: demoUser,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3天前
  },
  {
    title: '實作刪除確認對話框',
    description: '新增刪除前的確認機制，避免誤刪',
    status: 'in-progress',
    assignedTo: demoUser,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2天前
  },
  {
    title: '優化錯誤處理',
    description: '改善前端錯誤處理機制，提供更友善的錯誤提示',
    status: 'pending',
    assignedTo: demoUser,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1天前
  },
  {
    title: '新增拖曳排序功能',
    description: '允許使用者通過拖曳改變 Todo 項目的排序',
    status: 'pending',
    assignedTo: demoUser,
    createdAt: new Date() // 今天
  },
  {
    title: '實作主題切換功能',
    description: '新增深色模式與淺色模式的切換',
    status: 'pending',
    assignedTo: demoUser,
    createdAt: new Date() // 今天
  },
  {
    title: '加入資料視覺化儀表板',
    description: '建立統計圖表展示任務完成情況',
    status: 'pending',
    assignedTo: demoUser,
    createdAt: new Date() // 今天
  },
];

// 清除現有數據並插入種子數據
async function seedDatabase() {
  try {
    // 清除現有 Todo 數據
    await Todo.deleteMany({});
    console.log('Existing todos deleted');

    // 插入種子數據
    const createdTodos = await Todo.insertMany(todoSeedData);
    console.log(`${createdTodos.length} todos successfully seeded!`);
    
    // 顯示插入的數據
    console.log('Seeded todos:');
    createdTodos.forEach(todo => {
      console.log(`- ${todo.title} (${todo.status})`);
    });

    mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding database:', error);
    mongoose.connection.close();
    process.exit(1);
  }
}

// 執行種子腳本
seedDatabase();
// apps/backend/src/scripts/seed-data.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// 載入環境變數
dotenv.config();

// 連接 MongoDB
mongoose
  .connect(process.env.MONGO_URI || 'mongodb://localhost:27017/todo-app')
  .then(() => console.log('MongoDB 連接成功，準備植入資料'))
  .catch(err => {
    console.error('MongoDB 連接錯誤:', err);
    process.exit(1);
  });

// 定義 Todo Schema (直接在這裡定義，避免路徑問題)
const TodoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, '標題為必填欄位'],
      trim: true,
      minlength: [3, '標題太短'],
      maxlength: [100, '標題太長'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, '描述太長'],
      default: '',
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'in-progress', 'completed'],
        message: '{VALUE} 不是有效的狀態',
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
const demoUser = '測試用戶';

// 預設的 Todo 種子資料
// 預設的 Todo 種子資料
const todoSeedData = [
  {
    title: '完成前端登入頁面',
    description: '實作 JWT 身份驗證並整合到登入表單，包含記住我功能',
    status: 'completed',
    assignedTo: demoUser,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7天前
  },
  {
    title: '設計 Todo 卡片元件',
    description: '使用 Tailwind CSS 和 shadcn/ui 建立響應式卡片設計',
    status: 'completed',
    assignedTo: demoUser,
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6天前
  },
  {
    title: '實作 Todo CRUD API',
    description: '建立後端 RESTful API 處理 Todo 的增刪改查操作',
    status: 'completed',
    assignedTo: demoUser,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5天前
  },
  {
    title: '實作 Todo 狀態切換功能',
    description: '實現點擊圖標切換待辦事項狀態，並添加狀態變更動畫',
    status: 'completed',
    assignedTo: demoUser,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4天前
  },
  {
    title: '整合 React Query',
    description: '在前端使用 React Query 管理 API 請求與資料狀態',
    status: 'completed',
    assignedTo: demoUser,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3天前
  },
  {
    title: '實作篩選與看板視圖',
    description: '實現按狀態分組顯示的看板視圖及列表視圖',
    status: 'in-progress',
    assignedTo: demoUser,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2天前
  },
  {
    title: '設計數據統計 API',
    description: '開發任務完成率和時間趨勢分析的後端 API',
    status: 'in-progress',
    assignedTo: demoUser,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1天前
  },
  {
    title: '實作數據視覺化儀表板',
    description: '設計任務完成率圖表和時間趨勢分析圖表',
    status: 'pending',
    assignedTo: demoUser,
    createdAt: new Date(), // 今天
  },
  {
    title: '優化 MongoDB 查詢效能',
    description: '新增索引並優化資料庫查詢',
    status: 'pending',
    assignedTo: demoUser,
    createdAt: new Date(), // 今天
  },
  {
    title: '設定 CI/CD 流程',
    description: '配置 GitHub Actions 自動化測試和部署流程',
    status: 'pending',
    assignedTo: demoUser,
    createdAt: new Date(), // 今天
  },
  {
    title: '實作容器化部署',
    description: '使用 Docker 打包應用程式，準備生產環境部署',
    status: 'pending',
    assignedTo: demoUser,
    createdAt: new Date(), // 今天
  },
];

// 清除現有數據並插入種子數據
async function seedDatabase() {
  try {
    // 清除現有 Todo 數據
    await Todo.deleteMany({});
    console.log('已刪除現有待辦事項資料');

    // 插入種子數據
    const createdTodos = await Todo.insertMany(todoSeedData);
    console.log(`成功植入 ${createdTodos.length} 筆待辦事項！`);

    // 顯示插入的數據
    console.log('已植入的待辦事項:');
    createdTodos.forEach(todo => {
      console.log(`- ${todo.title} (${todo.status})`);
    });

    mongoose.connection.close();
    console.log('資料庫連接已關閉');
  } catch (error) {
    console.error('植入資料時發生錯誤:', error);
    mongoose.connection.close();
    process.exit(1);
  }
}

// 執行種子腳本
seedDatabase();

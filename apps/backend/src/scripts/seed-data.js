// apps/backend/src/scripts/seed-data.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
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

// 定義 User Schema
const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

// 定義 Todo Schema (直接在這裡定義，避免路徑問題)
const TodoSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
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
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// 創建模型
const User = mongoose.model('User', UserSchema);
const Todo = mongoose.model('Todo', TodoSchema);

// 測試用戶資料
const testUserData = {
  email: 'test@example.com',
  password: 'Test1234@',
  name: '測試用戶',
};

// 清除現有數據並插入種子數據
async function seedDatabase() {
  try {
    // 建立或取得測試用戶
    let testUser = await User.findOne({ email: testUserData.email });
    const hashedPassword = await bcrypt.hash(testUserData.password, 12);
    if (!testUser) {
      testUser = await User.create({
        ...testUserData,
        password: hashedPassword,
      });
      console.log(`已建立測試用戶：${testUser.email} (id: ${testUser._id})`);
    } else {
      // 每次都重設密碼，確保與種子資料一致
      await User.updateOne({ _id: testUser._id }, { $set: { password: hashedPassword } });
      console.log(`已更新測試用戶密碼：${testUser.email} (id: ${testUser._id})`);
    }

    const userId = testUser._id;

    // 清除現有 Todo 數據
    await Todo.deleteMany({});
    console.log('已刪除現有待辦事項資料');

    // 預設的 Todo 種子資料
    const todoSeedData = [
      {
        userId,
        title: '完成前端登入頁面',
        description: '實作 JWT 身份驗證並整合到登入表單，包含記住我功能',
        status: 'completed',
        assignedTo: testUserData.name,
        completedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
      {
        userId,
        title: '設計 Todo 卡片元件',
        description: '使用 Tailwind CSS 和 shadcn/ui 建立響應式卡片設計',
        status: 'completed',
        assignedTo: testUserData.name,
        completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      },
      {
        userId,
        title: '實作 Todo CRUD API',
        description: '建立後端 RESTful API 處理 Todo 的增刪改查操作',
        status: 'completed',
        assignedTo: testUserData.name,
        completedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        userId,
        title: '實作 Todo 狀態切換功能',
        description: '實現點擊圖標切換待辦事項狀態，並添加狀態變更動畫',
        status: 'completed',
        assignedTo: testUserData.name,
        completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      },
      {
        userId,
        title: '整合 React Query',
        description: '在前端使用 React Query 管理 API 請求與資料狀態',
        status: 'completed',
        assignedTo: testUserData.name,
        completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        userId,
        title: '實作篩選與看板視圖',
        description: '實現按狀態分組顯示的看板視圖及列表視圖',
        status: 'in-progress',
        assignedTo: testUserData.name,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        userId,
        title: '設計數據統計 API',
        description: '開發任務完成率和時間趨勢分析的後端 API',
        status: 'in-progress',
        assignedTo: testUserData.name,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        userId,
        title: '實作數據視覺化儀表板',
        description: '設計任務完成率圖表和時間趨勢分析圖表',
        status: 'pending',
        assignedTo: testUserData.name,
        createdAt: new Date(),
      },
      {
        userId,
        title: '優化 MongoDB 查詢效能',
        description: '新增索引並優化資料庫查詢',
        status: 'pending',
        assignedTo: testUserData.name,
        createdAt: new Date(),
      },
      {
        userId,
        title: '設定 CI/CD 流程',
        description: '配置 GitHub Actions 自動化測試和部署流程',
        status: 'pending',
        assignedTo: testUserData.name,
        createdAt: new Date(),
      },
      {
        userId,
        title: '實作容器化部署',
        description: '使用 Docker 打包應用程式，準備生產環境部署',
        status: 'pending',
        assignedTo: testUserData.name,
        createdAt: new Date(),
      },
    ];

    // 插入種子數據
    const createdTodos = await Todo.insertMany(todoSeedData);
    console.log(`成功植入 ${createdTodos.length} 筆待辦事項！`);

    // 顯示插入的數據
    console.log('已植入的待辦事項:');
    createdTodos.forEach(todo => {
      console.log(`- [${todo.status}] ${todo.title}`);
    });

    console.log('\n測試用戶登入資訊:');
    console.log(`  Email: ${testUserData.email}`);
    console.log(`  Password: ${testUserData.password}`);

    mongoose.connection.close();
    console.log('\n資料庫連接已關閉');
  } catch (error) {
    console.error('植入資料時發生錯誤:', error);
    mongoose.connection.close();
    process.exit(1);
  }
}

// 執行種子腳本
seedDatabase();

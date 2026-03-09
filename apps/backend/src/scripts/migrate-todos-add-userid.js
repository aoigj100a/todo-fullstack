// apps/backend/src/scripts/migrate-todos-add-userid.js
// Migration: 清除沒有 userId 的舊 todo 資料
//
// 使用方式：
//   node apps/backend/src/scripts/migrate-todos-add-userid.js
//
// 說明：
//   此 script 會找出所有沒有 userId 的 todo 文件並刪除。
//   由於 userId 是必填欄位且無法反推原本所屬用戶，選擇刪除比指派給錯誤用戶更安全。
//   刪除後請執行 seed-data.js 重新注入種子資料。
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI || 'mongodb://localhost:27017/todo-app')
  .then(() => console.log('MongoDB 連接成功'))
  .catch(err => {
    console.error('MongoDB 連接錯誤:', err);
    process.exit(1);
  });

const TodoSchema = new mongoose.Schema({}, { strict: false });
const Todo = mongoose.model('Todo', TodoSchema);

async function migrate() {
  try {
    // 找出沒有 userId 的 todos
    const orphanedTodos = await Todo.find({
      $or: [{ userId: { $exists: false } }, { userId: null }],
    });

    if (orphanedTodos.length === 0) {
      console.log('沒有找到缺少 userId 的 todo 資料，無需 migration。');
      mongoose.connection.close();
      return;
    }

    console.log(`找到 ${orphanedTodos.length} 筆缺少 userId 的 todo 資料：`);
    orphanedTodos.forEach(todo => {
      console.log(`  - [${todo._id}] ${todo.title || '(無標題)'}`);
    });

    // 刪除這些 todos
    const result = await Todo.deleteMany({
      $or: [{ userId: { $exists: false } }, { userId: null }],
    });

    console.log(`\n已刪除 ${result.deletedCount} 筆缺少 userId 的 todo 資料。`);
    console.log('請執行 seed-data.js 重新注入種子資料：');
    console.log('  node apps/backend/src/scripts/seed-data.js');

    mongoose.connection.close();
    console.log('\n資料庫連接已關閉');
  } catch (error) {
    console.error('Migration 發生錯誤:', error);
    mongoose.connection.close();
    process.exit(1);
  }
}

migrate();

// src/services/todo.ts
const mockTodos = [
  {
    _id: "1",
    title: "完成專案架構設計",
    description: "規劃資料夾結構、設定基礎配置、建立開發環境",
    status: "completed" as const,
    assignedTo: "Jenny",
    createdAt: new Date("2024-02-15").toISOString(),
    updatedAt: new Date("2024-02-16").toISOString(),
  },
  {
    _id: "2",
    title: "實作身份驗證功能",
    description: "使用 JWT 實作登入、註冊和權限控制機制",
    status: "in-progress" as const,
    assignedTo: "Jenny",
    createdAt: new Date("2024-02-16").toISOString(),
    updatedAt: new Date("2024-02-16").toISOString(),
  },
  {
    _id: "3",
    title: "設計資料庫結構",
    description: "設計 MongoDB 的 Schema，包含使用者和待辦事項的資料結構",
    status: "pending" as const,
    assignedTo: "Jenny",
    createdAt: new Date("2024-02-17").toISOString(),
    updatedAt: new Date("2024-02-17").toISOString(),
  },
  {
    _id: "4",
    title: "建立 API 文件",
    description: "使用 Swagger 產生 API 文件，包含所有端點的詳細說明",
    status: "pending" as const,
    assignedTo: "Jenny",
    createdAt: new Date("2024-02-17").toISOString(),
    updatedAt: new Date("2024-02-17").toISOString(),
  },
  {
    _id: "5",
    title: "前端效能優化",
    description: "實作延遲載入、壓縮資源、快取策略等優化措施",
    status: "in-progress" as const,
    assignedTo: "Jenny",
    createdAt: new Date("2024-02-18").toISOString(),
    updatedAt: new Date("2024-02-18").toISOString(),
  },
];

export const todoService = {
  getTodos: async () => {
    console.log('Service: Fetching todos');
    await new Promise(resolve => setTimeout(resolve, 1000));
    return mockTodos;
  },

  createTodo: async (todo: Omit<(typeof mockTodos)[0], "_id" | "createdAt" | "updatedAt">) => {
    console.log('Service: Creating todo');
    await new Promise(resolve => setTimeout(resolve, 500));
    const newTodo = {
      _id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...todo,
    };
    mockTodos.push(newTodo);
    return newTodo;
  },

  deleteTodo: async (id: string) => {
    console.log('Service: Starting delete in mock service');
    // 確保模擬服務至少需要 5 秒才能完成刪除
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    const index = mockTodos.findIndex((todo) => todo._id === id);
    if (index === -1) {
      throw new Error("Todo not found");
    }
    
    mockTodos.splice(index, 1);
    console.log('Service: Completing delete in mock service');
    return true;
  },

  updateTodo: async (id: string, updates: Partial<Omit<(typeof mockTodos)[0], "_id" | "createdAt">>) => {
    console.log('Service: Updating todo');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const todo = mockTodos.find((todo) => todo._id === id);
    if (!todo) {
      throw new Error("Todo not found");
    }
    
    Object.assign(todo, { ...updates, updatedAt: new Date().toISOString() });
    return todo;
  },
};
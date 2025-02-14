// src/test-todo.ts
import mongoose from 'mongoose';
import { Todo } from './models/Todo';

// MongoDB 連線設定
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/todo-test');
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// 清理資料庫
const cleanup = async () => {
  try {
    await Todo.deleteMany({});
    console.log('Database cleaned');
  } catch (error) {
    console.error('Error cleaning database:', error);
    throw error;
  }
};

// 測試建立 Todo
const testCreateTodo = async () => {
  try {
    const mockUserId = new mongoose.Types.ObjectId();
    const mockAssigneeId = new mongoose.Types.ObjectId();

    const newTodo = new Todo({
      title: 'Test Todo',
      description: 'This is a test todo',
      status: 'pending',
      createdBy: mockUserId,
      assignedTo: mockAssigneeId,
      dueDate: new Date('2025-03-01')
    });

    const savedTodo = await newTodo.save();
    console.log('Created Todo:', JSON.stringify(savedTodo.toJSON(), null, 2));
    return savedTodo;
  } catch (error) {
    console.error('Error creating todo:', error);
    throw error;
  }
};

// 測試查詢 Todo
const testGetTodos = async () => {
  try {
    const todos = await Todo.find().lean();
    console.log('All Todos:', JSON.stringify(todos, null, 2));
    return todos;
  } catch (error) {
    console.error('Error fetching todos:', error);
    throw error;
  }
};

// 測試更新 Todo
const testUpdateTodo = async (todoId: string) => {
  try {
    const updatedTodo = await Todo.findByIdAndUpdate(
      todoId,
      {
        status: 'in-progress',
        description: 'Updated description'
      },
      { new: true }
    );
    console.log('Updated Todo:', JSON.stringify(updatedTodo, null, 2));
    return updatedTodo;
  } catch (error) {
    console.error('Error updating todo:', error);
    throw error;
  }
};

// 測試刪除 Todo
const testDeleteTodo = async (todoId: string) => {
  try {
    const deletedTodo = await Todo.findByIdAndDelete(todoId);
    console.log('Deleted Todo:', JSON.stringify(deletedTodo, null, 2));
    return deletedTodo;
  } catch (error) {
    console.error('Error deleting todo:', error);
    throw error;
  }
};

// 執行測試
const runTests = async () => {
  await connectDB();
  
  try {
    console.log('\n--- Cleaning up database ---');
    await cleanup();

    console.log('\n--- Testing Todo Creation ---');
    const createdTodo = await testCreateTodo();
    
    console.log('\n--- Testing Todo Retrieval ---');
    await testGetTodos();

    if (createdTodo) {
      console.log('\n--- Testing Todo Update ---');
      await testUpdateTodo(createdTodo._id.toString());
      
      console.log('\n--- Testing Todo Deletion ---');
      await testDeleteTodo(createdTodo._id.toString());

      console.log('\n--- Final Todo List ---');
      await testGetTodos();
    }
  } catch (error) {
    console.error('Test execution failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  }
};

// 執行測試程式
runTests().catch(console.error);
// src/models/Todo.ts
import mongoose from 'mongoose';

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true // 自動管理 createdAt 和 updatedAt
});

export const Todo = mongoose.model('Todo', todoSchema);
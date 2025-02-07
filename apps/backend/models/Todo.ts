// src/models/Todo.ts
import mongoose from 'mongoose';

export interface ITodo {
  title:string;
  description?:string;
  timestamps?:Date; 
}

export interface ITodoDocument extends ITodo, Document {}

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true,'標題是必須的'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    maxlength:[500,'描述不能超過五百字']
  },
  completed: {
    type: Boolean,
    default: false,
    index:true //完成狀態索引
  }
}, {
  timestamps: true, // 自動管理 createdAt 和 updatedAt
  toJSON:{
    transform:(_,ret)=>{
      ret.id=ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

export const Todo = mongoose.model<ITodoDocument>('Todo', todoSchema);
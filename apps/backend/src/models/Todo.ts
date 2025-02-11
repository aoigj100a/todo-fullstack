// src/models/Todo.ts
import mongoose, { Schema, Document } from "mongoose";

export interface ITodo {
  title: string;
  description?: string;
  status: "pending" | "in-progress" | "completed";
  dueDate?: Date;
  assignedTo: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITodoDocument extends ITodo, Document {}

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
    minlength: [3, "Title too short"],
    maxlength: [100, "Title too long"],
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, "Description too long"],
    default: "",
  },
  status: {
    type: String,
    enum: {
      values: ["pending", "in-progress", "completed"],
      message: "{VALUE} is not a valid status",
    },
    default: "pending",
    required: true,
  },
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    immutable: true,
  },
  dueDate: {
    type: Date,
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
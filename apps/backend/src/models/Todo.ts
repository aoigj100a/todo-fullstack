// src/models/Todo.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface ITodo extends Document {
  title: string;
  description?: string;
  status: 'pending' | 'in-progress' | 'completed';
  assignedTo: string;
  createdAt: Date;
  updatedAt: Date;
  completeAt:Date;
}

const TodoSchema = new Schema(
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
    completedAt:{
      type:Date,
      default:null,
    }
  },
  {
    timestamps: true,
  }
);

export const Todo = mongoose.model<ITodo>('Todo', TodoSchema);

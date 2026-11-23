import mongoose from 'mongoose';

export const TASK_STATUSES = ['todo', 'in-progress', 'done'];

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, trim: true, default: '' },
    status: { type: String, enum: TASK_STATUSES, default: 'todo' },
  },
  { timestamps: true, versionKey: false },
);

export const Task = mongoose.model('Task', taskSchema);

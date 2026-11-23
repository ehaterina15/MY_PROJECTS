import mongoose from 'mongoose';
import { Task } from '../models/task.model.js';

const isValidId = (id) => mongoose.isValidObjectId(id);

export function createTask(data) {
  return Task.create(data);
}

export function listTasks(filter = {}) {
  return Task.find(filter).sort({ createdAt: -1 });
}

export async function getTaskById(id) {
  return isValidId(id) ? Task.findById(id) : null;
}

export async function updateTask(id, data) {
  if (!isValidId(id)) return null;
  return Task.findByIdAndUpdate(id, data, { returnDocument: 'after', runValidators: true });
}

export async function deleteTask(id) {
  return isValidId(id) ? Task.findByIdAndDelete(id) : null;
}

import * as taskService from '../services/task.service.js';
import { HttpError } from '../utils/http-error.js';

const notFound = (id) => new HttpError(404, `Task ${id} not found`);

export async function create(req, res) {
  const task = await taskService.createTask(req.body);
  res.status(201).json(task);
}

export async function list(req, res) {
  const filter = req.query.status ? { status: req.query.status } : {};
  res.json(await taskService.listTasks(filter));
}

export async function getById(req, res) {
  const task = await taskService.getTaskById(req.params.id);
  if (!task) throw notFound(req.params.id);
  res.json(task);
}

export async function update(req, res) {
  const task = await taskService.updateTask(req.params.id, req.body);
  if (!task) throw notFound(req.params.id);
  res.json(task);
}

export async function remove(req, res) {
  const task = await taskService.deleteTask(req.params.id);
  if (!task) throw notFound(req.params.id);
  res.status(204).end();
}

import { Router } from 'express';
import * as taskController from '../controllers/task.controller.js';

// Express 5 forwards rejected promises from async handlers to the error middleware.
export const taskRouter = Router();

taskRouter.post('/', taskController.create);
taskRouter.get('/', taskController.list);
taskRouter.get('/:id', taskController.getById);
taskRouter.patch('/:id', taskController.update);
taskRouter.delete('/:id', taskController.remove);

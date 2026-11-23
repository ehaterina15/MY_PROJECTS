import express from 'express';
import { taskRouter } from './routes/task.routes.js';
import { errorHandler, notFoundHandler } from './middlewares/error-handler.js';

export function createApp() {
  const app = express();

  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/api/tasks', taskRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

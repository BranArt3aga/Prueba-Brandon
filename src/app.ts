import express, { Application } from 'express';
import { taskRouter } from './routes/taskRoutes';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler';

export function createApp(): Application {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get('/health', (_req, res) => {
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    });
  });

  app.use('/api/v1/tasks', taskRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

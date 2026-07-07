import { Request, Response, NextFunction } from 'express';
import { TaskService } from '../services/TaskService';
import { TaskStatus, TaskPriority } from '../models/Task';

export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  getAll = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const page = parseInt(req.query['page'] as string) || 1;
      const limit = parseInt(req.query['limit'] as string) || 10;
      const status = req.query['status'] as TaskStatus | undefined;
      const priority = req.query['priority'] as TaskPriority | undefined;
      const search = req.query['search'] as string | undefined;

      const result = this.taskService.getAll(
        { status, priority, search },
        { page, limit },
      );

      res.status(200).json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  };

  getById = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const task = this.taskService.getById(req.params['id'] as string);
      res.status(200).json({ success: true, data: task });
    } catch (err) {
      next(err);
    }
  };

  create = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const task = this.taskService.create(req.body);
      res.status(201).json({ success: true, data: task });
    } catch (err) {
      next(err);
    }
  };

  update = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const task = this.taskService.update(req.params['id'] as string, req.body);
      res.status(200).json({ success: true, data: task });
    } catch (err) {
      next(err);
    }
  };

  delete = (req: Request, res: Response, next: NextFunction): void => {
    try {
      this.taskService.delete(req.params['id'] as string);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  };
}

import { Router } from 'express';
import { TaskController } from '../controllers/TaskController';
import { TaskService } from '../services/TaskService';
import { InMemoryTaskRepository } from '../repositories/TaskRepository';

const router = Router();

const repository = new InMemoryTaskRepository();
const service = new TaskService(repository);
const controller = new TaskController(service);

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

export { router as taskRouter };

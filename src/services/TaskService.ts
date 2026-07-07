import {
  Task,
  CreateTaskDTO,
  UpdateTaskDTO,
  TaskFilters,
  PaginationOptions,
  PaginatedResult,
} from '../models/Task';
import { ITaskRepository } from '../repositories/TaskRepository';
import { NotFoundError, ValidationError } from '../types/errors';

export class TaskService {
  constructor(private readonly repository: ITaskRepository) {}

  getAll(
    filters: TaskFilters,
    pagination: PaginationOptions,
  ): PaginatedResult<Task> {
    if (pagination.page < 1) {
      throw new ValidationError('Page must be greater than 0');
    }
    if (pagination.limit < 1 || pagination.limit > 100) {
      throw new ValidationError('Limit must be between 1 and 100');
    }
    return this.repository.findAll(filters, pagination);
  }

  getById(id: string): Task {
    const task = this.repository.findById(id);
    if (!task) {
      throw new NotFoundError(`Task with id '${id}'`);
    }
    return task;
  }

  create(dto: CreateTaskDTO): Task {
    if (!dto.title || dto.title.trim().length === 0) {
      throw new ValidationError('Title is required');
    }
    if (dto.title.trim().length > 200) {
      throw new ValidationError('Title must not exceed 200 characters');
    }
    if (!dto.description && dto.description !== '') {
      throw new ValidationError('Description is required');
    }
    if (dto.dueDate && isNaN(Date.parse(dto.dueDate))) {
      throw new ValidationError('Invalid due date format');
    }
    if (dto.dueDate && new Date(dto.dueDate) < new Date()) {
      throw new ValidationError('Due date cannot be in the past');
    }
    return this.repository.create(dto);
  }

  update(id: string, dto: UpdateTaskDTO): Task {
    this.getById(id);

    if (dto.title !== undefined && dto.title.trim().length === 0) {
      throw new ValidationError('Title cannot be empty');
    }
    if (dto.title !== undefined && dto.title.trim().length > 200) {
      throw new ValidationError('Title must not exceed 200 characters');
    }
    if (dto.dueDate !== undefined && dto.dueDate !== null && isNaN(Date.parse(dto.dueDate))) {
      throw new ValidationError('Invalid due date format');
    }

    const updated = this.repository.update(id, dto);
    if (!updated) {
      throw new NotFoundError(`Task with id '${id}'`);
    }
    return updated;
  }

  delete(id: string): void {
    this.getById(id);
    this.repository.delete(id);
  }
}

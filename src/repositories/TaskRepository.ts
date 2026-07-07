import { randomUUID } from 'crypto';
import {
  Task,
  TaskStatus,
  TaskPriority,
  CreateTaskDTO,
  UpdateTaskDTO,
  TaskFilters,
  PaginationOptions,
  PaginatedResult,
} from '../models/Task';

export interface ITaskRepository {
  findAll(filters: TaskFilters, pagination: PaginationOptions): PaginatedResult<Task>;
  findById(id: string): Task | undefined;
  create(dto: CreateTaskDTO): Task;
  update(id: string, dto: UpdateTaskDTO): Task | undefined;
  delete(id: string): boolean;
}

export class InMemoryTaskRepository implements ITaskRepository {
  private tasks: Map<string, Task> = new Map();

  findAll(filters: TaskFilters, pagination: PaginationOptions): PaginatedResult<Task> {
    let results = Array.from(this.tasks.values());

    if (filters.status) {
      results = results.filter((t) => t.status === filters.status);
    }

    if (filters.priority) {
      results = results.filter((t) => t.priority === filters.priority);
    }

    if (filters.search) {
      const term = filters.search.toLowerCase();
      results = results.filter(
        (t) =>
          t.title.toLowerCase().includes(term) ||
          t.description.toLowerCase().includes(term),
      );
    }

    const total = results.length;
    const totalPages = Math.ceil(total / pagination.limit);
    const start = (pagination.page - 1) * pagination.limit;
    const data = results.slice(start, start + pagination.limit);

    return {
      data,
      total,
      page: pagination.page,
      limit: pagination.limit,
      totalPages,
    };
  }

  findById(id: string): Task | undefined {
    return this.tasks.get(id);
  }

  create(dto: CreateTaskDTO): Task {
    const now = new Date();
    const task: Task = {
      id: randomUUID(),
      title: dto.title.trim(),
      description: dto.description.trim(),
      status: TaskStatus.PENDING,
      priority: dto.priority ?? TaskPriority.MEDIUM,
      dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
      createdAt: now,
      updatedAt: now,
    };
    this.tasks.set(task.id, task);
    return task;
  }

  update(id: string, dto: UpdateTaskDTO): Task | undefined {
    const existing = this.tasks.get(id);
    if (!existing) return undefined;

    const updated: Task = {
      ...existing,
      ...(dto.title !== undefined && { title: dto.title.trim() }),
      ...(dto.description !== undefined && { description: dto.description.trim() }),
      ...(dto.status !== undefined && { status: dto.status }),
      ...(dto.priority !== undefined && { priority: dto.priority }),
      ...(dto.dueDate !== undefined && {
        dueDate: dto.dueDate === null ? undefined : new Date(dto.dueDate),
      }),
      updatedAt: new Date(),
    };

    this.tasks.set(id, updated);
    return updated;
  }

  delete(id: string): boolean {
    return this.tasks.delete(id);
  }
}

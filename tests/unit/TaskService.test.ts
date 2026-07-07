import { TaskService } from '../../src/services/TaskService';
import { ITaskRepository, InMemoryTaskRepository } from '../../src/repositories/TaskRepository';
import { Task, TaskStatus, TaskPriority } from '../../src/models/Task';
import { ValidationError, NotFoundError } from '../../src/types/errors';

describe('TaskService', () => {
  let service: TaskService;
  let repository: ITaskRepository;

  beforeEach(() => {
    repository = new InMemoryTaskRepository();
    service = new TaskService(repository);
  });

  describe('create', () => {
    it('should create a valid task', () => {
      const task = service.create({ title: 'My Task', description: 'Description' });
      expect(task.id).toBeDefined();
      expect(task.title).toBe('My Task');
    });

    it('should throw ValidationError if title is empty', () => {
      expect(() => service.create({ title: '', description: 'Desc' })).toThrow(
        ValidationError,
      );
    });

    it('should throw ValidationError if title is only whitespace', () => {
      expect(() => service.create({ title: '   ', description: 'Desc' })).toThrow(
        ValidationError,
      );
    });

    it('should throw ValidationError if description is empty', () => {
      expect(() => service.create({ title: 'Valid Title', description: '' })).toThrow(
        ValidationError,
      );
    });

    it('should throw ValidationError if title exceeds 200 chars', () => {
      expect(() =>
        service.create({ title: 'a'.repeat(201), description: 'Desc' }),
      ).toThrow(ValidationError);
    });

    it('should throw ValidationError for invalid due date', () => {
      expect(() =>
        service.create({ title: 'T', description: 'D', dueDate: 'not-a-date' }),
      ).toThrow(ValidationError);
    });

    it('should throw ValidationError for past due date', () => {
      expect(() =>
        service.create({ title: 'T', description: 'D', dueDate: '2000-01-01' }),
      ).toThrow(ValidationError);
    });

    it('should accept future due date', () => {
      const task = service.create({
        title: 'T',
        description: 'D',
        dueDate: '2099-12-31',
      });
      expect(task.dueDate).toBeInstanceOf(Date);
    });
  });

  describe('getById', () => {
    it('should return task by id', () => {
      const created = service.create({ title: 'Find', description: 'Me' });
      const found = service.getById(created.id);
      expect(found).toEqual(created);
    });

    it('should throw NotFoundError for unknown id', () => {
      expect(() => service.getById('bad-id')).toThrow(NotFoundError);
    });
  });

  describe('getAll', () => {
    it('should throw ValidationError for page < 1', () => {
      expect(() => service.getAll({}, { page: 0, limit: 10 })).toThrow(
        ValidationError,
      );
    });

    it('should throw ValidationError for limit > 100', () => {
      expect(() => service.getAll({}, { page: 1, limit: 101 })).toThrow(
        ValidationError,
      );
    });

    it('should return paginated tasks', () => {
      service.create({ title: 'Task 1', description: 'Desc' });
      service.create({ title: 'Task 2', description: 'Desc' });
      const result = service.getAll({}, { page: 1, limit: 10 });
      expect(result.data).toHaveLength(2);
      expect(result.total).toBe(2);
    });
  });

  describe('update', () => {
    let task: Task;

    beforeEach(() => {
      task = service.create({ title: 'Original', description: 'Desc' });
    });

    it('should update title', () => {
      const updated = service.update(task.id, { title: 'Updated' });
      expect(updated.title).toBe('Updated');
    });

    it('should update status to COMPLETED', () => {
      const updated = service.update(task.id, { status: TaskStatus.COMPLETED });
      expect(updated.status).toBe(TaskStatus.COMPLETED);
    });

    it('should throw NotFoundError for unknown id', () => {
      expect(() => service.update('bad-id', { title: 'X' })).toThrow(NotFoundError);
    });

    it('should throw ValidationError for empty title', () => {
      expect(() => service.update(task.id, { title: '' })).toThrow(ValidationError);
    });

    it('should throw ValidationError for invalid due date', () => {
      expect(() => service.update(task.id, { dueDate: 'invalid' })).toThrow(
        ValidationError,
      );
    });
  });

  describe('delete', () => {
    it('should delete existing task', () => {
      const task = service.create({ title: 'Delete', description: 'Me' });
      expect(() => service.delete(task.id)).not.toThrow();
      expect(() => service.getById(task.id)).toThrow(NotFoundError);
    });

    it('should throw NotFoundError for unknown id', () => {
      expect(() => service.delete('bad-id')).toThrow(NotFoundError);
    });
  });
});

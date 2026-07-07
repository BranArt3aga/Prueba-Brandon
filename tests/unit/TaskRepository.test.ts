import { InMemoryTaskRepository } from '../../src/repositories/TaskRepository';
import { TaskStatus, TaskPriority } from '../../src/models/Task';

describe('InMemoryTaskRepository', () => {
  let repo: InMemoryTaskRepository;

  beforeEach(() => {
    repo = new InMemoryTaskRepository();
  });

  describe('create', () => {
    it('should create a task with default status PENDING', () => {
      const task = repo.create({ title: 'Test', description: 'Desc' });
      expect(task.id).toBeDefined();
      expect(task.status).toBe(TaskStatus.PENDING);
      expect(task.priority).toBe(TaskPriority.MEDIUM);
      expect(task.title).toBe('Test');
    });

    it('should create a task with custom priority', () => {
      const task = repo.create({
        title: 'Urgent',
        description: 'Desc',
        priority: TaskPriority.HIGH,
      });
      expect(task.priority).toBe(TaskPriority.HIGH);
    });

    it('should trim whitespace from title and description', () => {
      const task = repo.create({ title: '  Hello  ', description: '  World  ' });
      expect(task.title).toBe('Hello');
      expect(task.description).toBe('World');
    });

    it('should parse and store dueDate', () => {
      const due = '2099-12-31';
      const task = repo.create({ title: 'T', description: 'D', dueDate: due });
      expect(task.dueDate).toBeInstanceOf(Date);
    });
  });

  describe('findById', () => {
    it('should return undefined for unknown id', () => {
      expect(repo.findById('nonexistent')).toBeUndefined();
    });

    it('should return task after creation', () => {
      const task = repo.create({ title: 'Find me', description: 'Here' });
      expect(repo.findById(task.id)).toEqual(task);
    });
  });

  describe('findAll', () => {
    beforeEach(() => {
      repo.create({ title: 'Alpha', description: 'First', priority: TaskPriority.HIGH });
      repo.create({ title: 'Beta', description: 'Second', priority: TaskPriority.LOW });
      repo.create({ title: 'Gamma', description: 'Third', priority: TaskPriority.MEDIUM });
    });

    it('should return all tasks with default pagination', () => {
      const result = repo.findAll({}, { page: 1, limit: 10 });
      expect(result.data).toHaveLength(3);
      expect(result.total).toBe(3);
      expect(result.totalPages).toBe(1);
    });

    it('should apply pagination correctly', () => {
      const result = repo.findAll({}, { page: 1, limit: 2 });
      expect(result.data).toHaveLength(2);
      expect(result.totalPages).toBe(2);
    });

    it('should return page 2 with remaining items', () => {
      const result = repo.findAll({}, { page: 2, limit: 2 });
      expect(result.data).toHaveLength(1);
    });

    it('should filter by priority', () => {
      const result = repo.findAll({ priority: TaskPriority.HIGH }, { page: 1, limit: 10 });
      expect(result.data).toHaveLength(1);
      expect(result.data[0]!.title).toBe('Alpha');
    });

    it('should filter by search term (title)', () => {
      const result = repo.findAll({ search: 'alpha' }, { page: 1, limit: 10 });
      expect(result.data).toHaveLength(1);
    });

    it('should filter by search term (description)', () => {
      const result = repo.findAll({ search: 'second' }, { page: 1, limit: 10 });
      expect(result.data).toHaveLength(1);
    });
  });

  describe('update', () => {
    it('should return undefined for unknown id', () => {
      expect(repo.update('unknown', { title: 'New' })).toBeUndefined();
    });

    it('should update task fields', () => {
      const task = repo.create({ title: 'Old', description: 'Desc' });
      const updated = repo.update(task.id, {
        title: 'New',
        status: TaskStatus.COMPLETED,
      });
      expect(updated!.title).toBe('New');
      expect(updated!.status).toBe(TaskStatus.COMPLETED);
      expect(updated!.updatedAt.getTime()).toBeGreaterThanOrEqual(task.updatedAt.getTime());
    });

    it('should remove dueDate when null is passed', () => {
      const task = repo.create({ title: 'T', description: 'D', dueDate: '2099-01-01' });
      const updated = repo.update(task.id, { dueDate: null });
      expect(updated!.dueDate).toBeUndefined();
    });
  });

  describe('delete', () => {
    it('should return false for unknown id', () => {
      expect(repo.delete('unknown')).toBe(false);
    });

    it('should delete existing task', () => {
      const task = repo.create({ title: 'Delete me', description: 'Desc' });
      expect(repo.delete(task.id)).toBe(true);
      expect(repo.findById(task.id)).toBeUndefined();
    });
  });
});

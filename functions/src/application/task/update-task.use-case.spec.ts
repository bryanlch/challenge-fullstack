import { UpdateTaskUseCase } from './update-task.use-case';
import { TaskRepository } from '../../domain/repositories/task.repository';
import { TaskStatus } from '../../domain/models/task-status.enum';

const mockRepo = {
   update: jest.fn()
} as unknown as TaskRepository;

describe('UpdateTaskUseCase', () => {
   it('should call the repository with the correct id and data', async () => {
      const useCase = new UpdateTaskUseCase(mockRepo);
      const taskId = 'task-123';
      const updates = { title: 'Updated Title', status: TaskStatus.IN_PROGRESS };

      await useCase.execute(taskId, updates);

      expect(mockRepo.update).toHaveBeenCalledWith(taskId, updates);
   });
});

import { DeleteTaskUseCase } from './delete-task.use-case';
import { TaskRepository } from '../../domain/repositories/task.repository';

const mockRepo = {
   delete: jest.fn()
} as unknown as TaskRepository;

describe('DeleteTaskUseCase', () => {
   it('should call the repository with the correct id', async () => {
      const useCase = new DeleteTaskUseCase(mockRepo);
      const taskId = 'task-123';

      await useCase.execute(taskId);

      expect(mockRepo.delete).toHaveBeenCalledWith(taskId);
   });
});

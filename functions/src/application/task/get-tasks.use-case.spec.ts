import { GetTasksUseCase } from './get-tasks.use-case';
import { TaskRepository } from '../../domain/repositories/task.repository';

const mockRepo = {
   getAllByUserId: jest.fn()
} as unknown as TaskRepository;

describe('GetTasksUseCase', () => {
   it('should call the repository with the userId', async () => {
      const useCase = new GetTasksUseCase(mockRepo);
      await useCase.execute('user-1');
      expect(mockRepo.getAllByUserId).toHaveBeenCalledWith('user-1');
   });
});
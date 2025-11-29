import { CreateTaskUseCase } from './create-task.use-case';
import { TaskRepository } from '../../domain/repositories/task.repository';
import { TaskStatus } from '../../domain/models/task-status.enum';

const mockTaskRepository = {
   create: jest.fn()
} as unknown as TaskRepository;

describe('CreateTaskUseCase', () => {
   let useCase: CreateTaskUseCase;

   beforeEach(() => {
      useCase = new CreateTaskUseCase(mockTaskRepository);
      jest.clearAllMocks();
   });

   it('should assign the task to self if assignedToId is empty', async () => {
      const supervisorId = 'sup-1';
      const assignedToId = '';
      const title = 'New Task';
      const desc = 'Description';

      await useCase.execute(supervisorId, assignedToId, title, desc);

      expect(mockTaskRepository.create).toHaveBeenCalledWith(expect.objectContaining({
         supervisorId: 'sup-1',
         assignedToId: 'sup-1',
         status: TaskStatus.PENDING
      }));
   });

   it('should assign the task to another user if specified', async () => {
      const supervisorId = 'sup-1';
      const assignedToId = 'user-2';

      await useCase.execute(supervisorId, assignedToId, 'T', 'D');

      expect(mockTaskRepository.create).toHaveBeenCalledWith(expect.objectContaining({
         supervisorId: 'sup-1',
         assignedToId: 'user-2'
      }));
   });
});
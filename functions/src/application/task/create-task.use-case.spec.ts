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

   it('debería asignar la tarea a uno mismo si assignedToId viene vacío', async () => {
      const supervisorId = 'sup-1';
      const assignedToId = '';
      const title = 'Nueva Tarea';
      const desc = 'Desc';

      await useCase.execute(supervisorId, assignedToId, title, desc);

      expect(mockTaskRepository.create).toHaveBeenCalledWith(expect.objectContaining({
         supervisorId: 'sup-1',
         assignedToId: 'sup-1',
         status: TaskStatus.PENDING
      }));
   });

   it('debería asignar la tarea a otro usuario si se especifica', async () => {
      const supervisorId = 'sup-1';
      const assignedToId = 'user-2';

      await useCase.execute(supervisorId, assignedToId, 'T', 'D');

      expect(mockTaskRepository.create).toHaveBeenCalledWith(expect.objectContaining({
         supervisorId: 'sup-1',
         assignedToId: 'user-2'
      }));
   });
});
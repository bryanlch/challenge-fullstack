import { Request, Response } from 'express';
import { createTask, getTasks } from './task.controller';
import { CreateTaskUseCase } from '../../../application/task/create-task.use-case';

jest.mock('../../../application/task/create-task.use-case');
jest.mock('../../../application/task/get-tasks.use-case');

describe('TaskController', () => {
   let mockReq: Partial<Request>;
   let mockRes: Partial<Response>;
   let jsonMock: jest.Mock;
   let statusMock: jest.Mock;

   beforeEach(() => {
      // Resetear mocks antes de cada test
      jest.clearAllMocks();

      jsonMock = jest.fn();
      statusMock = jest.fn().mockReturnValue({ json: jsonMock });

      mockRes = {
         status: statusMock
      } as unknown as Response;
   });

   describe('createTask', () => {
      it('debería crear una tarea exitosamente (201)', async () => {
         // Setup
         mockReq = {
            body: { title: 'Test', description: 'Desc' },
            user: { uid: 'user-123' } // Simulamos token decodificado
         } as any;

         // Mockear la ejecución exitosa del caso de uso
         (CreateTaskUseCase.prototype.execute as jest.Mock).mockResolvedValue({ id: 'task-1' });

         // Ejecutar
         await createTask(mockReq as Request, mockRes as Response);

         // Verificar
         expect(statusMock).toHaveBeenCalledWith(201);
         expect(jsonMock).toHaveBeenCalledWith({ id: 'task-1' });
      });

      it('debería retornar 401 si no hay usuario autenticado', async () => {
         mockReq = { body: {}, user: undefined } as any; // Sin usuario

         await createTask(mockReq as Request, mockRes as Response);

         expect(statusMock).toHaveBeenCalledWith(401);
         expect(jsonMock).toHaveBeenCalledWith({ message: 'User not authenticated' });
      });

      it('debería retornar 500 si el caso de uso falla', async () => {
         mockReq = { body: {}, user: { uid: '123' } } as any;

         // Forzamos un error
         (CreateTaskUseCase.prototype.execute as jest.Mock).mockRejectedValue(new Error('DB Error'));

         await createTask(mockReq as Request, mockRes as Response);

         expect(statusMock).toHaveBeenCalledWith(500);
         expect(jsonMock).toHaveBeenCalledWith({ message: 'Error creating task' });
      });
   });

   // Agrega un bloque similar para getTasks...
});
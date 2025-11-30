import { Request, Response } from 'express';
import * as taskController from './task.controller';
import { CreateTaskUseCase } from '../../../application/task/create-task.use-case';
import { GetTasksUseCase } from '../../../application/task/get-tasks.use-case';
import { UpdateTaskUseCase } from '../../../application/task/update-task.use-case';
import { DeleteTaskUseCase } from '../../../application/task/delete-task.use-case';

jest.mock('../../../application/task/create-task.use-case');
jest.mock('../../../application/task/get-tasks.use-case');
jest.mock('../../../application/task/update-task.use-case');
jest.mock('../../../application/task/delete-task.use-case');

describe('TaskController', () => {
   let mockReq: Partial<Request>;
   let mockRes: Partial<Response>;
   let jsonMock: jest.Mock;
   let statusMock: jest.Mock;

   beforeEach(() => {
      jest.clearAllMocks();
      jsonMock = jest.fn();
      statusMock = jest.fn().mockReturnValue({ json: jsonMock });
      mockRes = { status: statusMock } as unknown as Response;
   });

   describe('createTask', () => {
      it('should return 201 on create', async () => {
         mockReq = { body: { title: 'T', description: 'Test description' }, user: { uid: 'u1' } } as any;
         (CreateTaskUseCase.prototype.execute as jest.Mock).mockResolvedValue({ id: '1' });
         await taskController.createTask(mockReq as Request, mockRes as Response);
         expect(statusMock).toHaveBeenCalledWith(201);
      });

      it('should return 401 if no user', async () => {
         mockReq = { body: {}, user: undefined } as any;
         await taskController.createTask(mockReq as Request, mockRes as Response);
         expect(statusMock).toHaveBeenCalledWith(401);
      });

      it('should return 500 on failure', async () => {
         mockReq = { body: { title: 'T', description: 'Test description' }, user: { uid: 'u1' } } as any;
         (CreateTaskUseCase.prototype.execute as jest.Mock).mockRejectedValue(new Error('Fail'));
         await taskController.createTask(mockReq as Request, mockRes as Response);
         expect(statusMock).toHaveBeenCalledWith(500);
      });
   });

   describe('getTasks', () => {
      it('should return 200 and the list', async () => {
         mockReq = { user: { uid: 'u1' } } as any;
         (GetTasksUseCase.prototype.execute as jest.Mock).mockResolvedValue([]);

         await taskController.getTasks(mockReq as Request, mockRes as Response);

         expect(statusMock).toHaveBeenCalledWith(200);
         expect(jsonMock).toHaveBeenCalledWith([]);
      });

      it('should return 500 on failure', async () => {
         mockReq = { user: { uid: 'u1' } } as any;
         (GetTasksUseCase.prototype.execute as jest.Mock).mockRejectedValue(new Error('Fail'));

         await taskController.getTasks(mockReq as Request, mockRes as Response);

         expect(statusMock).toHaveBeenCalledWith(500);
      });
   });

   describe('updateTask', () => {
      it('should return 200 on update', async () => {
         mockReq = { params: { id: '1' }, body: { title: 'New' }, user: { uid: 'u1' } } as any;
         (UpdateTaskUseCase.prototype.execute as jest.Mock).mockResolvedValue(undefined);

         await taskController.updateTask(mockReq as Request, mockRes as Response);

         expect(statusMock).toHaveBeenCalledWith(200);
         expect(jsonMock).toHaveBeenCalledWith({ message: 'Task updated successfully' });
      });
   });

   describe('deleteTask', () => {
      it('should return 200 on delete', async () => {
         mockReq = { params: { id: '1' }, user: { uid: 'u1' } } as any;
         (DeleteTaskUseCase.prototype.execute as jest.Mock).mockResolvedValue(undefined);

         await taskController.deleteTask(mockReq as Request, mockRes as Response);

         expect(statusMock).toHaveBeenCalledWith(200);
         expect(jsonMock).toHaveBeenCalledWith({ message: 'Task deleted successfully' });
      });
   });
});
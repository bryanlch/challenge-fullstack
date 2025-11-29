import { Request, Response } from 'express';
import { FirestoreTaskRepository } from '../../database/firestore-task.repository';
import { CreateTaskUseCase } from '../../../application/task/create-task.use-case';
import { GetTasksUseCase } from '../../../application/task/get-tasks.use-case';
import { DeleteTaskUseCase } from '../../../application/task/delete-task.use-case';
import { UpdateTaskUseCase } from '../../../application/task/update-task.use-case';

import { HttpStatus } from '../../../domain/constants/http-status.constant';
import { TaskMessages } from '../../../domain/constants/task-messages.constant';

const taskRepository = new FirestoreTaskRepository();
const createTaskUseCase = new CreateTaskUseCase(taskRepository);
const getTasksUseCase = new GetTasksUseCase(taskRepository);
const deleteTaskUseCase = new DeleteTaskUseCase(taskRepository);
const updateTaskUseCase = new UpdateTaskUseCase(taskRepository);

export const createTask = async (req: Request, res: Response) => {
   try {
      const userId = req.user?.uid;

      if (!userId) {
         res.status(HttpStatus.UNAUTHORIZED).json({
            message: TaskMessages.VALIDATION.AUTH_REQUIRED
         });
         return;
      }

      const { title, description, assignedToId } = req.body;

      if (!title || !description) {
         res.status(HttpStatus.BAD_REQUEST).json({
            message: TaskMessages.VALIDATION.DATA_REQUIRED
         });
         return;
      }

      const task = await createTaskUseCase.execute(userId, assignedToId, title, description);

      res.status(HttpStatus.CREATED).json(task);

   } catch (error: unknown) {
      const message = TaskMessages.ERROR.CREATE_FAILED;
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message });
   }
};

export const getTasks = async (req: Request, res: Response) => {
   try {
      const userId = req.user?.uid;

      if (!userId) {
         res.status(HttpStatus.UNAUTHORIZED).json({
            message: TaskMessages.VALIDATION.AUTH_REQUIRED
         });
         return;
      }

      const tasks = await getTasksUseCase.execute(userId);
      res.status(HttpStatus.OK).json(tasks);

   } catch (error: unknown) {
      const message = TaskMessages.ERROR.GET_FAILED;
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message });
   }
};

export const updateTask = async (req: Request, res: Response) => {
   try {
      const { id } = req.params;
      const updates = req.body;

      if (!id) {
         res.status(HttpStatus.BAD_REQUEST).json({
            message: TaskMessages.VALIDATION.ID_REQUIRED
         });
         return;
      }

      await updateTaskUseCase.execute(id, updates);

      res.status(HttpStatus.OK).json({
         message: TaskMessages.SUCCESS.UPDATED
      });

   } catch (error: unknown) {
      const message = TaskMessages.ERROR.UPDATE_FAILED;
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message });
   }
};

export const deleteTask = async (req: Request, res: Response) => {
   try {
      const { id } = req.params;

      if (!id) {
         res.status(HttpStatus.BAD_REQUEST).json({
            message: TaskMessages.VALIDATION.ID_REQUIRED
         });
         return;
      }

      await deleteTaskUseCase.execute(id);

      res.status(HttpStatus.OK).json({
         message: TaskMessages.SUCCESS.DELETED
      });

   } catch (error: unknown) {
      const message = TaskMessages.ERROR.DELETE_FAILED;
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message });
   }
};
import { Request, Response } from 'express';
import { FirestoreTaskRepository } from '../../database/firestore-task.repository';
import { CreateTaskUseCase } from '../../../application/task/create-task.use-case';
import { GetTasksUseCase } from '../../../application/task/get-tasks.use-case';
import { DeleteTaskUseCase } from '../../../application/task/delete-task.use-case';
import { UpdateTaskUseCase } from '../../../application/task/update-task.use-case';

const taskRepository = new FirestoreTaskRepository();
const createTaskUseCase = new CreateTaskUseCase(taskRepository);
const getTasksUseCase = new GetTasksUseCase(taskRepository);
const deleteTaskUseCase = new DeleteTaskUseCase(taskRepository);
const updateTaskUseCase = new UpdateTaskUseCase(taskRepository);

export const createTask = async (req: Request, res: Response) => {
   try {
      const userId = req.user?.uid;
      const {
         title,
         description,
         assignedToId,
         supervisorId
      } = req.body;

      if (!userId) {
         res.status(401).json({ message: 'User not authenticated' });
         return;
      }

      const task = await createTaskUseCase.execute(supervisorId, assignedToId, title, description);
      res.status(201).json(task);
   } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error creating task' });
   }
};

export const getTasks = async (req: Request, res: Response) => {
   try {
      const userId = req.user?.uid;
      if (!userId) {
         res.status(401).json({ message: 'User not authenticated' });
         return;
      }

      const tasks = await getTasksUseCase.execute(userId);
      res.status(200).json(tasks);
   } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error getting tasks' });
   }
};

export const updateTask = async (req: Request, res: Response) => {
   try {
      const { id } = req.params;
      const updates = req.body;
      await updateTaskUseCase.execute(id, updates);
      res.status(200).json({ message: 'Task updated successfully' });
   } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error updating task' });
   }
}

export const deleteTask = async (req: Request, res: Response) => {
   try {
      const { id } = req.params;
      await deleteTaskUseCase.execute(id);
      res.status(200).json({ message: 'Task deleted successfully' });
   } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error deleting task' });
   }
};
import { TaskStatus } from "../../domain/models/task-status.enum";
import { Task } from "../../domain/models/task.model";
import { TaskRepository } from "../../domain/repositories/task.repository";

export class CreateTaskUseCase {
   constructor(private taskRepository: TaskRepository) { }

   async execute(supervisorId: string, assignedToId: string, title: string, description: string): Promise<Task> {
      const newTask: Task = {
         supervisorId,
         assignedToId: assignedToId || supervisorId,
         title,
         description,
         status: TaskStatus.PENDING,
         createdAt: new Date()
      };
      return await this.taskRepository.create(newTask);
   }
}
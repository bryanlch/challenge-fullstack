import { Task } from "../../domain/models/task.model";
import { TaskRepository } from "../../domain/repositories/task.repository";

export class GetTasksUseCase {
   constructor(private taskRepository: TaskRepository) { }

   async execute(userId: string): Promise<Task[]> {
      return await this.taskRepository.getAllByUserId(userId);
   }
}
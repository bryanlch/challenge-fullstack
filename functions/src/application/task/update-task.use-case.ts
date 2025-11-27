import { Task } from "../../domain/models/task.model";
import { TaskRepository } from "../../domain/repositories/task.repository";

export class UpdateTaskUseCase {
   constructor(private taskRepository: TaskRepository) { }
   async execute(id: string, updates: Partial<Task>): Promise<void> {
      await this.taskRepository.update(id, updates);
      return;
   }
}
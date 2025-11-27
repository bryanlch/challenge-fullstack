import { Task } from "../models/task.model";

export interface TaskRepository {
   create(task: Task): Promise<Task>;
   getAllByUserId(userId: string): Promise<Task[]>;
   update(id: string, task: Partial<Task>): Promise<void>;
   delete(id: string): Promise<void>;
}
import { TaskStatus } from "./task-status.enum";

export interface Task {
   id?: string;
   supervisorId: string;
   assignedToId: string;
   title: string;
   description: string;
   status: TaskStatus;
   createdAt?: Date;
}
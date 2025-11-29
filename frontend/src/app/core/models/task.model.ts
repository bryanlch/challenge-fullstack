export type TaskStatus = 'pending' | 'in_progress' | 'completed';

export interface Task {
   id: any;
   supervisorId: string;
   assignedToId: string;
   title: string;
   description: string;
   status: TaskStatus;
   createdAt: string | Date;
}

export type TaskAction = 'edit' | 'delete' | 'create';

export interface TaskWithAction extends Task {
   action: TaskAction;
}

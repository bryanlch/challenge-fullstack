import { Filter } from "firebase-admin/firestore";
import { db } from "../../config/firebase";
import { Task } from "../../domain/models/task.model";
import { TaskRepository } from "../../domain/repositories/task.repository";

export class FirestoreTaskRepository implements TaskRepository {
   private collection = db.collection('tasks');

   async create(task: Task): Promise<Task> {
      const docRef = await this.collection.add(task);
      return { ...task, id: docRef.id };
   }

   async update(id: string, task: Partial<Task>): Promise<void> {
      await this.collection.doc(id).update(task);
   }

   async delete(id: string): Promise<void> {
      await this.collection.doc(id).delete();
   }

   async getAllByUserId(currentUserId: string): Promise<Task[]> {
      const q1 = this.collection
         .where('assignedToId', '==', currentUserId)
         .get();

      const q2 = this.collection
         .where('supervisorId', '==', currentUserId)
         .get();

      const [s1, s2] = await Promise.all([q1, q2]);

      const tasks = [
         ...s1.docs.map(d => ({ id: d.id, ...(d.data() as Task) } as Task)),
         ...s2.docs.map(d => ({ id: d.id, ...(d.data() as Task) } as Task))
      ];

      const unique = new Map(tasks.map(t => [t.id, t]));

      return Array.from(unique.values()).sort(
         (a, b) => (b.createdAt as unknown as number) - (a.createdAt as unknown as number)
      );
   }

}
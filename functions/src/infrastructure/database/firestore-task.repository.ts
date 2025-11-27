import { db } from "../../config/firebase";
import { Task } from "../../domain/models/task.model";
import { TaskRepository } from "../../domain/repositories/task.repository";

export class FirestoreTaskRepository implements TaskRepository {
   private collection = db.collection('tasks');

   async create(task: Task): Promise<Task> {
      const docRef = await this.collection.add(task);
      return { ...task, id: docRef.id };
   }

   async getAllByUserId(userId: string): Promise<Task[]> {
      const snapshot = await this.collection
         .where('userId', '==', userId)
         .orderBy('createdAt', 'desc')
         .get();

      if (snapshot.empty) return [];

      return snapshot.docs.map(doc => ({
         id: doc.id,
         ...doc.data()
      })) as Task[];
   }

   async update(id: string, task: Partial<Task>): Promise<void> {
      await this.collection.doc(id).update(task);
   }

   async delete(id: string): Promise<void> {
      await this.collection.doc(id).delete();
   }
}
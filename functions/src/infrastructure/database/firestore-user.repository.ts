import { db } from "../../config/firebase";
import { User } from "../../domain/models/user.model";
import { UserRepository } from "../../domain/repositories/user.repository";

export class FirestoreUserRepository implements UserRepository {
   private collection = db.collection('users');

   async searchUsers(term: string): Promise<User[]> {
      const q = term.trim();
      if (!q) return [];

      const resultsMap = new Map<string, User>();

      const [nameSnap, lastnameSnap, emailSnap] = await Promise.all([
         this.collection.where('name', '==', q).get(),
         this.collection.where('lastname', '==', q).get(),
         this.collection.where('email', '==', q).get()
      ]);

      const addFromSnapshot = (snap: FirebaseFirestore.QuerySnapshot) => {
         if (!snap.empty) {
            snap.docs.forEach(doc => {
               const u = doc.data() as User;
               if (u && u.email) resultsMap.set(u.email, u);
            });
         }
      };

      addFromSnapshot(nameSnap);
      addFromSnapshot(lastnameSnap);
      addFromSnapshot(emailSnap);

      return Array.from(resultsMap.values());
   }

   async findByEmail(email: string): Promise<User | null> {
      const snapshot = await this.collection.doc(email).get();
      if (!snapshot.exists) return null;
      return snapshot.data() as User;
   }

   async create(user: User): Promise<User> {
      await this.collection.doc(user.email).set({
         ...user,
         createdAt: new Date()
      });
      return user;
   }

   async getAll(): Promise<User[]> {
      const snapshot = await this.collection.get();

      return snapshot.docs.map(doc => ({
         uid: doc.id,
         ...doc.data()
      })) as User[];
   }
}
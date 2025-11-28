import { User } from "../models/user.model";

export interface UserRepository {
   searchUsers(term: string): Promise<User[]>;
   findByEmail(email: string): Promise<User | null>;
   create(user: User): Promise<User>;
   getAll(): Promise<User[]>;
}
import { User } from "../../domain/models/user.model";
import { UserRepository } from "../../domain/repositories/user.repository";

export class GetAllUserUseCase {
   constructor(private userRepository: UserRepository) { }

   async execute(): Promise<User[]> {
      try {
         const users = await this.userRepository.getAll();
         return users;
      } catch (error) {
         throw error;
      }
   }
}
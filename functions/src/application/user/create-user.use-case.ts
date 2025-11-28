import { User } from "../../domain/models/user.model";
import { UserRepository } from "../../domain/repositories/user.repository";

export class CreateUserUseCase {
   constructor(private userRepository: UserRepository) { }

   async execute(uid: string, name: string, lastname: string, email: string): Promise<User> {
      const newUser: User = {
         uid,
         name,
         lastname,
         email,
         createdAt: new Date()
      };

      return await this.userRepository.create(newUser);
   }
}
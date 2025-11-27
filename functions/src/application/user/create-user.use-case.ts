import { User } from "../../domain/models/user.model";
import { UserRepository } from "../../domain/repositories/user.repository";

export class CreateUserUseCase {
   constructor(private userRepository: UserRepository) { }

   async execute(name: string, email: string, lastname: string): Promise<User> {
      const newUser: User = {
         name: name,
         email: email,
         lastname: lastname,
         createdAt: new Date()
      };

      return await this.userRepository.create(newUser);
   }
}
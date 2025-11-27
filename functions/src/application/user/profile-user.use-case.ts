import { User } from "../../domain/models/user.model";
import { UserRepository } from "../../domain/repositories/user.repository";

export class ProfileUserUseCase {
   constructor(private userRepository: UserRepository) { }

   async execute(email: string): Promise<User | null> {
      return await this.userRepository.findByEmail(email);
   }
}
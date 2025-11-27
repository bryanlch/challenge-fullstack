import { UserRepository } from "../../domain/repositories/user.repository";

export class CheckUserUseCase {
   constructor(private userRepository: UserRepository) { }

   async execute(email: string): Promise<{ exists: boolean }> {
      try {
         const user = await this.userRepository.findByEmail(email);
         return { exists: !!user };
      } catch (error) {
         throw error;
      }
   }
}
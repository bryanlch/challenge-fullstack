import { User } from "../../domain/models/user.model";
import { UserRepository } from "../../domain/repositories/user.repository";


export class SearchUserUseCase {
   constructor(private userRepository: UserRepository) { }

   async execute(term: string): Promise<User[]> {
      return await this.userRepository.searchUsers(term);
   }
}
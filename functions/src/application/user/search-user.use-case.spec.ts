import { SearchUserUseCase } from './search-user.use-case';
import { UserRepository } from '../../domain/repositories/user.repository';

describe('SearchUserUseCase', () => {
   let useCase: SearchUserUseCase;
   let mockUserRepository: Partial<UserRepository>;

   beforeEach(() => {
      mockUserRepository = {
         searchUsers: jest.fn()
      };
      useCase = new SearchUserUseCase(mockUserRepository as UserRepository);
   });

   it('should return matching users', async () => {
      const mockUsers = [{ uid: '1' }];
      (mockUserRepository.searchUsers as jest.Mock).mockResolvedValue(mockUsers);

      const result = await useCase.execute('term');

      expect(result).toEqual(mockUsers);
   });
});

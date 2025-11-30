import { GetAllUserUseCase } from './get-all-user.use-case';
import { UserRepository } from '../../domain/repositories/user.repository';

describe('GetAllUserUseCase', () => {
   let useCase: GetAllUserUseCase;
   let mockUserRepository: Partial<UserRepository>;

   beforeEach(() => {
      mockUserRepository = {
         getAll: jest.fn()
      };
      useCase = new GetAllUserUseCase(mockUserRepository as UserRepository);
   });

   it('should return a list of users', async () => {
      const mockUsers = [{ uid: '1' }];
      (mockUserRepository.getAll as jest.Mock).mockResolvedValue(mockUsers);

      const result = await useCase.execute();

      expect(result).toEqual(mockUsers);
   });

   it('should propagate errors from repository', async () => {
      (mockUserRepository.getAll as jest.Mock).mockRejectedValue(new Error('Repo Error'));
      await expect(useCase.execute()).rejects.toThrow('Repo Error');
   });
});

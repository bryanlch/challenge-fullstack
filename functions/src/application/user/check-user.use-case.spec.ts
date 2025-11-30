import { CheckUserUseCase } from './check-user.use-case';
import { UserRepository } from '../../domain/repositories/user.repository';

describe('CheckUserUseCase', () => {
   let useCase: CheckUserUseCase;
   let mockUserRepository: Partial<UserRepository>;

   beforeEach(() => {
      mockUserRepository = {
         findByEmail: jest.fn()
      };
      useCase = new CheckUserUseCase(mockUserRepository as UserRepository);
   });

   it('should return exists: true when user is found', async () => {
      (mockUserRepository.findByEmail as jest.Mock).mockResolvedValue({ email: 'test@test.com' });
      const result = await useCase.execute('test@test.com');
      expect(result).toEqual({ exists: true });
   });

   it('should return exists: false when user is not found', async () => {
      (mockUserRepository.findByEmail as jest.Mock).mockResolvedValue(null);
      const result = await useCase.execute('test@test.com');
      expect(result).toEqual({ exists: false });
   });

   it('should propagate errors from repository', async () => {
      (mockUserRepository.findByEmail as jest.Mock).mockRejectedValue(new Error('Repo Error'));
      await expect(useCase.execute('test@test.com')).rejects.toThrow('Repo Error');
   });
});

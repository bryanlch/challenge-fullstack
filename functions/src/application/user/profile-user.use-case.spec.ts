import { ProfileUserUseCase } from './profile-user.use-case';
import { UserRepository } from '../../domain/repositories/user.repository';

describe('ProfileUserUseCase', () => {
   let useCase: ProfileUserUseCase;
   let mockUserRepository: Partial<UserRepository>;

   beforeEach(() => {
      mockUserRepository = {
         findByEmail: jest.fn()
      };
      useCase = new ProfileUserUseCase(mockUserRepository as UserRepository);
   });

   it('should return user when found', async () => {
      const mockUser = { uid: '1' };
      (mockUserRepository.findByEmail as jest.Mock).mockResolvedValue(mockUser);

      const result = await useCase.execute('test@test.com');

      expect(result).toEqual(mockUser);
   });

   it('should return null when not found', async () => {
      (mockUserRepository.findByEmail as jest.Mock).mockResolvedValue(null);

      const result = await useCase.execute('test@test.com');

      expect(result).toBeNull();
   });
});

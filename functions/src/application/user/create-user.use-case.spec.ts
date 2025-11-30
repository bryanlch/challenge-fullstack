import { CreateUserUseCase } from './create-user.use-case';
import { UserRepository } from '../../domain/repositories/user.repository';
import { User } from '../../domain/models/user.model';

describe('CreateUserUseCase', () => {
   let useCase: CreateUserUseCase;
   let mockUserRepository: Partial<UserRepository>;

   beforeEach(() => {
      mockUserRepository = {
         create: jest.fn()
      };
      useCase = new CreateUserUseCase(mockUserRepository as UserRepository);
   });

   it('should create and return a user', async () => {
      const mockUser: User = { uid: '1', name: 'John', lastname: 'Doe', email: 'j@d.com', createdAt: new Date() };
      (mockUserRepository.create as jest.Mock).mockResolvedValue(mockUser);

      const result = await useCase.execute('1', 'John', 'Doe', 'j@d.com');

      expect(mockUserRepository.create).toHaveBeenCalledWith(expect.objectContaining({
         uid: '1', name: 'John', lastname: 'Doe', email: 'j@d.com'
      }));
      expect(result).toEqual(mockUser);
   });
});

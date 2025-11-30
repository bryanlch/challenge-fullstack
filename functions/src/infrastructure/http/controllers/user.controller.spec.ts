import { Request, Response } from 'express';
import * as userController from './user.controller';
import { CheckUserUseCase } from '../../../application/user/check-user.use-case';
import { CreateUserUseCase } from '../../../application/user/create-user.use-case';
import { ProfileUserUseCase } from '../../../application/user/profile-user.use-case';
import { SearchUserUseCase } from '../../../application/user/search-user.use-case';
import { GetAllUserUseCase } from '../../../application/user/get-all-user.use-case';
import { UserMessages } from '../../../domain/constants/user-messages.constant';
import { HttpStatus } from '../../../domain/constants/http-status.constant';

jest.mock('../../../application/user/check-user.use-case');
jest.mock('../../../application/user/create-user.use-case');
jest.mock('../../../application/user/profile-user.use-case');
jest.mock('../../../application/user/search-user.use-case');
jest.mock('../../../application/user/get-all-user.use-case');

describe('UserController', () => {
   let mockReq: Partial<Request>;
   let mockRes: Partial<Response>;
   let jsonMock: jest.Mock;
   let statusMock: jest.Mock;

   beforeEach(() => {
      jest.clearAllMocks();
      jsonMock = jest.fn();
      statusMock = jest.fn().mockReturnValue({ json: jsonMock });
      mockRes = { status: statusMock } as unknown as Response;
   });

   describe('checkUser', () => {
      it('should return 200 and user data when email is valid', async () => {
         mockReq = { params: { email: 'test@example.com' } };
         const mockUser = { email: 'test@example.com', exists: true };
         (CheckUserUseCase.prototype.execute as jest.Mock).mockResolvedValue(mockUser);

         await userController.checkUser(mockReq as Request, mockRes as Response);

         expect(statusMock).toHaveBeenCalledWith(HttpStatus.OK);
         expect(jsonMock).toHaveBeenCalledWith(mockUser);
      });

      it('should return 400 when email is missing', async () => {
         mockReq = { params: {} };

         await userController.checkUser(mockReq as Request, mockRes as Response);

         expect(statusMock).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
         expect(jsonMock).toHaveBeenCalledWith({ message: UserMessages.VALIDATION.EMAIL_REQUIRED });
      });

      it('should return 500 on internal error', async () => {
         mockReq = { params: { email: 'test@example.com' } };
         (CheckUserUseCase.prototype.execute as jest.Mock).mockRejectedValue(new Error('Internal Error'));

         await userController.checkUser(mockReq as Request, mockRes as Response);

         expect(statusMock).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
         expect(jsonMock).toHaveBeenCalledWith({ message: 'Internal Error' });
      });
   });

   describe('createUser', () => {
      it('should return 201 when user is created successfully', async () => {
         mockReq = {
            user: { uid: 'user123' },
            body: { name: 'John', lastname: 'Doe', email: 'john@example.com' }
         } as any;
         (CheckUserUseCase.prototype.execute as jest.Mock).mockResolvedValue({ exists: false });
         (CreateUserUseCase.prototype.execute as jest.Mock).mockResolvedValue({ id: 'user123', name: 'John' });

         await userController.createUser(mockReq as Request, mockRes as Response);

         expect(statusMock).toHaveBeenCalledWith(201);
         expect(jsonMock).toHaveBeenCalledWith({ id: 'user123', name: 'John' });
      });

      it('should return 401 when user is not authenticated', async () => {
         mockReq = { user: undefined, body: {} } as any;

         await userController.createUser(mockReq as Request, mockRes as Response);

         expect(statusMock).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
         expect(jsonMock).toHaveBeenCalledWith({ message: UserMessages.VALIDATION.AUTH_REQUIRED });
      });

      it('should return 400 when required data is missing', async () => {
         mockReq = {
            user: { uid: 'user123' },
            body: { name: 'John' }
         } as any;

         await userController.createUser(mockReq as Request, mockRes as Response);

         expect(statusMock).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
         expect(jsonMock).toHaveBeenCalledWith({ message: UserMessages.VALIDATION.DATA_REQUIRED });
      });

      it('should return 400 when user already exists', async () => {
         mockReq = {
            user: { uid: 'user123' },
            body: { name: 'John', lastname: 'Doe', email: 'john@example.com' }
         } as any;
         (CheckUserUseCase.prototype.execute as jest.Mock).mockResolvedValue({ exists: true });

         await userController.createUser(mockReq as Request, mockRes as Response);

         expect(statusMock).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
         expect(jsonMock).toHaveBeenCalledWith({ message: UserMessages.ERROR.ALREADY_EXISTS });
      });

      it('should return 500 on internal error', async () => {
         mockReq = {
            user: { uid: 'user123' },
            body: { name: 'John', lastname: 'Doe', email: 'john@example.com' }
         } as any;
         (CheckUserUseCase.prototype.execute as jest.Mock).mockResolvedValue({ exists: false });
         (CreateUserUseCase.prototype.execute as jest.Mock).mockRejectedValue(new Error('Create Failed'));

         await userController.createUser(mockReq as Request, mockRes as Response);

         expect(statusMock).toHaveBeenCalledWith(500);
         expect(jsonMock).toHaveBeenCalledWith({ message: 'Create Failed' });
      });
   });

   describe('profileUser', () => {
      it('should return 200 and user profile when found', async () => {
         mockReq = { query: { email: 'test@example.com' } } as any;
         const mockProfile = { email: 'test@example.com', name: 'Test' };
         (ProfileUserUseCase.prototype.execute as jest.Mock).mockResolvedValue(mockProfile);

         await userController.profileUser(mockReq as Request, mockRes as Response);

         expect(statusMock).toHaveBeenCalledWith(HttpStatus.OK);
         expect(jsonMock).toHaveBeenCalledWith(mockProfile);
      });

      it('should return 400 when email query param is missing', async () => {
         mockReq = { query: {} } as any;

         await userController.profileUser(mockReq as Request, mockRes as Response);

         expect(statusMock).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
         expect(jsonMock).toHaveBeenCalledWith({ message: UserMessages.VALIDATION.EMAIL_REQUIRED });
      });

      it('should return 404 when user is not found', async () => {
         mockReq = { query: { email: 'unknown@example.com' } } as any;
         (ProfileUserUseCase.prototype.execute as jest.Mock).mockResolvedValue(null);

         await userController.profileUser(mockReq as Request, mockRes as Response);

         expect(statusMock).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
         expect(jsonMock).toHaveBeenCalledWith({ message: UserMessages.ERROR.NOT_FOUND });
      });

      it('should return 500 on internal error', async () => {
         mockReq = { query: { email: 'test@example.com' } } as any;
         (ProfileUserUseCase.prototype.execute as jest.Mock).mockRejectedValue(new Error('Profile Error'));

         await userController.profileUser(mockReq as Request, mockRes as Response);

         expect(statusMock).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
         expect(jsonMock).toHaveBeenCalledWith({ message: 'Profile Error' });
      });
   });

   describe('searchUser', () => {
      it('should return 200 and list of users when term is valid', async () => {
         mockReq = { query: { term: 'search' } } as any;
         const mockUsers = [{ name: 'User 1' }, { name: 'User 2' }];
         (SearchUserUseCase.prototype.execute as jest.Mock).mockResolvedValue(mockUsers);

         await userController.searchUser(mockReq as Request, mockRes as Response);

         expect(statusMock).toHaveBeenCalledWith(HttpStatus.OK);
         expect(jsonMock).toHaveBeenCalledWith(mockUsers);
      });

      it('should return 400 when search term is missing', async () => {
         mockReq = { query: {} } as any;

         await userController.searchUser(mockReq as Request, mockRes as Response);

         expect(statusMock).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
         expect(jsonMock).toHaveBeenCalledWith({ message: UserMessages.VALIDATION.SEARCH_TERM_REQUIRED });
      });

      it('should return 500 on internal error', async () => {
         mockReq = { query: { term: 'search' } } as any;
         (SearchUserUseCase.prototype.execute as jest.Mock).mockRejectedValue(new Error('Search Error'));

         await userController.searchUser(mockReq as Request, mockRes as Response);

         expect(statusMock).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
         expect(jsonMock).toHaveBeenCalledWith({ message: 'Search Error' });
      });
   });

   describe('getAllUsers', () => {
      it('should return 200 and all users', async () => {
         mockReq = {};
         const mockUsers = [{ name: 'User 1' }, { name: 'User 2' }];
         (GetAllUserUseCase.prototype.execute as jest.Mock).mockResolvedValue(mockUsers);

         await userController.getAllUsers(mockReq as Request, mockRes as Response);

         expect(statusMock).toHaveBeenCalledWith(HttpStatus.OK);
         expect(jsonMock).toHaveBeenCalledWith(mockUsers);
      });

      it('should return 500 on internal error', async () => {
         mockReq = {};
         (GetAllUserUseCase.prototype.execute as jest.Mock).mockRejectedValue(new Error('Get All Error'));

         await userController.getAllUsers(mockReq as Request, mockRes as Response);

         expect(statusMock).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
         expect(jsonMock).toHaveBeenCalledWith({ message: 'Get All Error' });
      });
   });
});

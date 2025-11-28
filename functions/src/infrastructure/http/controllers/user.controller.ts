import { Request, Response } from 'express';
import { FirestoreUserRepository } from '../../database/firestore-user.repository';
import { CheckUserUseCase } from '../../../application/user/check-user.use-case';
import { CreateUserUseCase } from '../../../application/user/create-user.use-case';
import { ProfileUserUseCase } from '../../../application/user/profile-user.use-case';
import { SearchUserUseCase } from '../../../application/user/search-user.use-case';
import { GetAllUserUseCase } from '../../../application/user/get-all-user.use-case';

import { UserMessages } from '../../../domain/constants/user-messages.constant';
import { HttpStatus } from '../../../domain/constants/http-status.constant';

const userRepository = new FirestoreUserRepository();
const checkUserUseCase = new CheckUserUseCase(userRepository);
const createUserUseCase = new CreateUserUseCase(userRepository);
const profileUserUseCase = new ProfileUserUseCase(userRepository);
const searchUserUseCase = new SearchUserUseCase(userRepository);
const getAllUserUseCase = new GetAllUserUseCase(userRepository);

export const checkUser = async (req: Request, res: Response) => {
   try {
      const { email } = req.params;

      if (!email || typeof email !== 'string') {
         res.status(HttpStatus.BAD_REQUEST).json({ message: UserMessages.VALIDATION.EMAIL_REQUIRED });
         return;
      }

      const user = await checkUserUseCase.execute(email);
      res.status(HttpStatus.OK).json(user);

   } catch (error: unknown) {
      const message = error instanceof Error ? error.message : UserMessages.ERROR.CHECK_FAILED;
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message });
   }
};

export const createUser = async (req: Request, res: Response) => {
   try {
      const userId = req.user?.uid;
      if (!userId) {
         res.status(HttpStatus.UNAUTHORIZED).json({ message: UserMessages.VALIDATION.AUTH_REQUIRED });
         return;
      }

      const { name, lastname, email } = req.body;

      if (!email || !name || !lastname) {
         res.status(HttpStatus.BAD_REQUEST).json({ message: UserMessages.VALIDATION.DATA_REQUIRED });
         return;
      }

      const userCheck = await checkUserUseCase.execute(email);
      if (userCheck.exists) {
         res.status(HttpStatus.BAD_REQUEST).json({ message: UserMessages.ERROR.ALREADY_EXISTS });
         return;
      }

      const userCreated = await createUserUseCase.execute(userId, name, lastname, email);

      res.status(201).json(userCreated);

   } catch (error: unknown) {
      const message = error instanceof Error ? error.message : UserMessages.ERROR.CREATE_FAILED;
      res.status(500).json({ message });
   }
};

export const profileUser = async (req: Request, res: Response) => {
   try {
      const email = req.query.email as string;

      if (!email) {
         res.status(HttpStatus.BAD_REQUEST).json({ message: UserMessages.VALIDATION.EMAIL_REQUIRED });
         return;
      }

      const user = await profileUserUseCase.execute(email);

      if (!user) {
         res.status(HttpStatus.NOT_FOUND).json({ message: UserMessages.ERROR.NOT_FOUND });
         return;
      }

      res.status(HttpStatus.OK).json(user);

   } catch (error: unknown) {
      const message = error instanceof Error ? error.message : UserMessages.ERROR.PROFILE_FAILED;
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message });
   }
};

export const searchUser = async (req: Request, res: Response) => {
   try {
      const term = req.query.term as string;

      if (!term) {
         res.status(HttpStatus.BAD_REQUEST).json({ message: UserMessages.VALIDATION.SEARCH_TERM_REQUIRED });
         return;
      }

      const users = await searchUserUseCase.execute(term);
      res.status(HttpStatus.OK).json(users);

   } catch (error: unknown) {
      const message = error instanceof Error ? error.message : UserMessages.ERROR.SEARCH_FAILED;
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message });
   }
};

export const getAllUsers = async (req: Request, res: Response) => {
   try {
      const users = await getAllUserUseCase.execute();
      res.status(HttpStatus.OK).json(users);
   } catch (error: unknown) {
      const message = error instanceof Error ? error.message : UserMessages.ERROR.GET_ALL_FAILED;
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message });
   }
};
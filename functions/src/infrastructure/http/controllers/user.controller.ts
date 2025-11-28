import { Request, Response } from 'express';
import { FirestoreUserRepository } from '../../database/firestore-user.repository';
import { CheckUserUseCase } from '../../../application/user/check-user.use-case';
import { CreateUserUseCase } from '../../../application/user/create-user.use-case';
import { ProfileUserUseCase } from '../../../application/user/profile-user.use-case';
import { SearchUserUseCase } from '../../../application/user/search-user.use-case';
import { GetAllUserUseCase } from '../../../application/user/get-all-user.use-case';

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
         res.status(400).json({ message: 'Email is required' });
         return;
      }

      const user = await checkUserUseCase.execute(email);

      res.status(200).json(user);
   } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Error checking user';
      res.status(500).json({ message });
   }
};

export const createUser = async (req: Request, res: Response) => {
   try {
      const { name, lastname, email } = req.body;
      if (!email || !name || !lastname) {
         res.status(400).json({ message: 'Name, Lastname and Email are required' });
         return;
      }

      const user = await checkUserUseCase.execute(email);
      if (user.exists) {
         res.status(400).json({ message: 'User already exists' });
         return;
      }

      const userCreated = await createUserUseCase.execute(name, lastname, email);
      res.status(201).json(userCreated);
   } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Error creating user';
      res.status(500).json({ message });
   }
};

export const profileUser = async (req: Request, res: Response) => {
   try {
      const { email } = req.query;
      if (!email || typeof email !== 'string') {
         res.status(400).json({ message: 'Email is required' });
         return;
      }

      const user = await profileUserUseCase.execute(email);
      if (!user) {
         res.status(404).json({ message: 'User not found' });
         return;
      }

      res.status(200).json(user);
   } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Error retrieving user profile';
      res.status(500).json({ message });
   }
};

export const searchUser = async (req: Request, res: Response) => {
   try {
      const { term } = req.query;
      if (!term || typeof term !== 'string') {
         res.status(400).json({ message: 'Search term is required' });
         return;
      }

      const users = await searchUserUseCase.execute(term);
      res.status(200).json(users);
   } catch (error) {
      const message = error instanceof Error ? error.message : 'Error retrieving user profile';
      res.status(500).json({ message });
   }
}

export const getAllUsers = async (req: Request, res: Response) => {
   try {
      const users = await getAllUserUseCase.execute();
      res.status(200).json(users);
   } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Error retrieving users';
      res.status(500).json({ message });
   }
}
import { Router } from 'express';
import {
   profileUser,
   createUser,
   checkUser,
   searchUser,
   getAllUsers
} from '../controllers/user.controller';

const router = Router();

router.post('/', createUser);
router.get('/', getAllUsers);
router.get('/profile', profileUser);
router.get('/check/:email', checkUser);
router.get('/search/:term', searchUser);

export const userRoutes = router;
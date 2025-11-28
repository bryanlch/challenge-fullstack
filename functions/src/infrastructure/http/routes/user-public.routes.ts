import { Router } from 'express';
import { checkUser } from '../controllers/user.controller';

const router = Router();

router.get('/check/:email', checkUser);

export const userPublicRoutes = router;
import { Request, Response, NextFunction } from 'express';
import * as admin from 'firebase-admin';

declare global {
   namespace Express {
      interface Request {
         user?: admin.auth.DecodedIdToken;
      }
   }
}

export const validateToken = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
         res.status(401).json({ message: 'Unauthorized: No token provided' });
         return;
      }

      const token = authHeader.split('Bearer ')[1];

      const decodedToken = await admin.auth().verifyIdToken(token);
      req.user = decodedToken;

      next();

   } catch (error) {
      console.error('Error verifying token:', error);
      res.status(401).json({ message: 'Unauthorized: Invalid token' });
   }
};
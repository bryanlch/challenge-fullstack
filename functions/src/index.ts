import * as functions from 'firebase-functions';
import express from 'express';
import cors from 'cors';
import { userRoutes } from './infrastructure/http/routes/user.routes';
import { validateToken } from './infrastructure/http/middleware/auth.middleware';
import { taskRoutes } from './infrastructure/http/routes/task.routes';

const app = express();

// Middleware
app.use(cors({ origin: true }));
app.use(express.json());

// Rutas
app.get('/health', (req, res) => {
   res.status(200).send('OK');
});
app.use('/api/v1/users', userRoutes);
// Rutas Privadas
app.use('/api/v1/tasks', validateToken, taskRoutes);

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
   console.error(err);
   res.status(500).json({ error: 'Internal Server Error' });
});

export const api = functions.https.onRequest(app);
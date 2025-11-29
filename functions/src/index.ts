import * as functions from 'firebase-functions';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { taskRoutes } from './infrastructure/http/routes/task.routes';
import { userRoutes } from './infrastructure/http/routes/user.routes';
import { userPublicRoutes } from './infrastructure/http/routes/user-public.routes';
import { validateToken } from './infrastructure/http/middleware/auth.middleware';
import { corsOptions } from './infrastructure/http/cors.config';

const app = express();

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(
   helmet({
      crossOriginResourcePolicy: false,
   })
);

app.use(rateLimit({
   windowMs: 60 * 1000,
   max: 200,
}));

app.use(express.json());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.disable('x-powered-by');

//routes
app.get('/health', (req, res) => {
   res.status(200).send('OK');
});
// routes public
app.use('/api/v1/users/public', userPublicRoutes);

// routes protected
app.use('/api/v1/users', validateToken, userRoutes);
app.use('/api/v1/tasks', validateToken, taskRoutes);

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
   console.error(err);
   res.status(500).json({ error: 'Internal Server Error' });
});

export const api = functions.https.onRequest(app);
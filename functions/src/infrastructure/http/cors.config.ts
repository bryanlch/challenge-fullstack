import cors from 'cors';

export const allowedOrigins = [
   'https://challenge-to-do.web.app',
   'http://localhost:4200'
];

export const corsOptions: cors.CorsOptions = {
   origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error('Not allowed by CORS'));
   },
   credentials: true,
};

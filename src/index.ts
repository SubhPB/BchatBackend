// Byimaan

import dotenv from 'dotenv';
import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';

import { bookRouter } from './api/routes/book';
import { RedisAPI } from './api/controllers/redisCotroller';
import { redisRouter } from './api/routes/redis';

dotenv.config();

const app: Express = express();
const port = process.env.APP_PORT;

app.use(bodyParser.json());
app.use('/api/books', bookRouter);
// app.use('/api/redis', RedisAPI.middleware, redisRouter)

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server {activated + test}');
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
})

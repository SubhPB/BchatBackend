// Byimaan

import express, { Express, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';

import { bookRouter } from './api/routes/book';
import { RedisMiddleware, RedisRouter } from './api/endpoints/redis';
import {clientHosts} from './consts'


dotenv.config();

const app: Express = express();
const port = process.env.APP_PORT;

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
      if ((origin && clientHosts.includes(origin)) || !origin) {
          callback(null, true);
      } else {
          callback(new Error('Not allowed by CORS'));
      }
  }
};

app.use(cors())

app.use(bodyParser.json());

app.use('/', function rootMiddleware(req:Request, res:Response, next: NextFunction){

  const clientIsAllowed = req.get('HOST') && clientHosts.includes(req.get('HOST') as string)
  console.log(`[${req.method} '${req.path}']: ${req.get('Host')} access~${clientIsAllowed}`)
  if (clientIsAllowed){
    next()
  } else {
    res.status(401).send(`${req.get('HOST')} is not allowed to access the resources of server.`)
  }
});

app.use('/api/books', bookRouter);

app.use('/api/redis',RedisMiddleware['*'], RedisMiddleware['POST'], RedisRouter({allowedMethods: ['GET', 'POST', 'DELETE']}))

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server {activated + test}');
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
})

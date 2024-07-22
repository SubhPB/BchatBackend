// Byimaan

import dotenv from 'dotenv';
import express, { Express, NextFunction, Request, Response } from 'express';
import bodyParser from 'body-parser';

import { bookRouter } from './api/routes/book';
import { RedisMiddleware, RedisRouter } from './api/endpoints/redis';
import {clientHosts} from './consts'


dotenv.config();

const app: Express = express();
const port = process.env.APP_PORT;

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

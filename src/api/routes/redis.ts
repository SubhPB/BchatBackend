// Byimaan

import express from 'express';
import { redisController } from '../controllers/redisCotroller';

const redisRouter = express.Router();

redisRouter.get('/', redisController.get)


export {redisRouter};

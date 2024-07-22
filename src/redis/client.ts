// Byimaan

import { Redis } from "ioredis";
import dotenv from 'dotenv';

dotenv.config();

const getRedisClient = () => {
    let redisClient : Redis | null = null;
    
    const options = {
        username: process.env.REDIS_USERNAME,
        password: process.env.REDIS_PASSWORD,
        port: parseInt(process.env.REDIS_PORT!) || 6379,
        host: process.env.REDIS_HOST
    };
    
    try{
        redisClient = new Redis(options);
    } catch (error) {
        console.log("[IoRedis Error]: Failed to setup the redis client");
        console.log(error)
    };
    return redisClient
}
export {getRedisClient};
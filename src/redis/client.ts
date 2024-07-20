// Byimaan

import { Redis } from "ioredis";

let redisClient : Redis | null = null;

try{
    redisClient = new Redis({
        username: process.env.REDIS_USERNAME,
        password: process.env.REDIS_PASSWORD,
        port: parseInt(process.env.REDIS_PORT!) || 6379,
        host: process.env.REDIS_HOST
    });
} catch (error) {
    console.log("[IoRedis Error]: Failed to setup the redis client");
    console.log(error)
};

export {redisClient};
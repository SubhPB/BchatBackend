// Byimaan

import { Request, Response } from "express";
import { redisClient } from "../../redis/client";
import { Redis } from "ioredis";


class RedisAPI {

    static middleware(req: Request, res: Response){
        if (!redisClient){
            res.status(503).send("Redis service is not available at the moment")
        };

        if (req.method === 'GET'){
            const body = req.body;

            if (!body || !body?.key || typeof body?.key !== 'string'){
                res.status(400).send("Invalid GET request.")
            }
        };

        if (req.method === 'POST' || req.method === 'UPDATE'){
            const body = req.body;

            if (!body || !body?.key || !body?.value){
                res.status(400).send("Invalid Request")
            }
        };

    }
}

class RedisController {
    
    async get(req: Request,res: Response){
        const {key} = req.body;
        await (redisClient as Redis).get(key, (err, result) => {
            if (err){
                res.status(404).send(err.message)
            } else {
                res.json(result)
            }
        });
    };


};

const redisController = new RedisController();

export {RedisAPI, redisController}
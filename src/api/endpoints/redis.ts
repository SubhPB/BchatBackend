// Byimaan

import { Redis } from "ioredis";
import express, { response } from "express";
import { getRedisClient } from "../../redis/client";

import { APIMiddleware } from "./types";
import { HTTPMethods } from "./types";

const RedisMiddleware: APIMiddleware = {
    '*': (req, res, next) => {

        const redisClient = getRedisClient()
        const allowedMethods = ['POST', 'GET', 'DELETE'];
        
        if (!redisClient){
            res.status(503).send("Redis service is not availabe at the moment")
        } else if (allowedMethods.includes(req.method)){
            next();
        } else {
            res.status(405).send(`${req.method} is not allowed`)
        }
    },
    'POST': (req,res, next) => {

        if (req.method === 'POST'){
            if (req.body && req.body?.key && req.body?.value){
                next()
            } else {
                res.status(400).send("Incomplete request body")
            }
        } else {
            next()
        }
    }
};


const RedisRouter = ({allowedMethods}: {allowedMethods: Exclude<(typeof HTTPMethods[number]), '*'>[]}) => {
    const router = express.Router();
    const redis = getRedisClient() as Redis;
    
    if (allowedMethods.includes('GET')){

        router.get('/:key', async (req, res) => {
            const {key} = req.params;
            try {
                await redis.get(decodeURIComponent(key), (err, result) => {
                    if (result){
                        res.json(result)
                    } else {
                        res.status(404).send(err?.message || `Not Found`)
                    }
                })
    
            } catch(error) {
                res.status(500).send(error instanceof Error ? error.message : "Server Error.")
            };
        })

        router.get('/', async (req, res) => {
            try {
                const key = req.body?.key;
                if (key){
                    await redis.get(key, (err, result) => {
                        if (result){
                            res.json(result)
                        } else {
                            res.status(404).send(err?.message || "Not Found!")
                        }
                    })
                } else {
                    res.status(404).send("Invalid request. Key is needed")
                }
    
            } catch(error) {
                res.status(500).send(error instanceof Error ? error.message : "Server Error.")
            };
        });

    };

    if (allowedMethods.includes('POST')){
        router.post('/', async (req, res) => {
            const searchParams = new URLSearchParams(req.url.split('?')[1]);
            let {key, value, ex=searchParams.get('ex'), nx=searchParams.get('nx')} = req.body
            const expiresAfter = parseInt(ex || '') || parseInt(searchParams.get('ex') || '')|| 12 * 60;
            const NX = nx && parseInt(nx || '') === 1;
            const redis = getRedisClient() as Redis;
        
            if (key){
                key = decodeURIComponent(key)
            }

            try {
                if (NX){
                    const response= await redis.setnx(key, JSON.stringify(value));

                    console.log('[response ] ', response);
                    if (response === 1){
                        await redis.expire(key, expiresAfter)
                        res.sendStatus(201)
                    } else {
                        res.sendStatus(406)
                    }
                } else {
                    const response = await redis.setex(key, expiresAfter, value);
                    res.status(201).send(response)
                }
    
            } catch(error) {
                console.log("[POST] Error ", error)
                res.status(500).send(error instanceof Error ? error.message : "Server Error.")
            }
        })
    };

    if (allowedMethods.includes("DELETE")){
        router.delete('/', async (req, res, next) => {
            try{
                const searchParams = new URLSearchParams(req.url.split('?')[1]);
                const key = req.body?.key || searchParams.get('key');
                if (key) {
                    const response = await redis.del(key);
                    if (response === 1){
                        res.sendStatus(202)
                    } else {
                        res.sendStatus(417)
                    }
                } else {
                    res.sendStatus(404)
                }
            } catch(error) {
                res.status(500).send(error instanceof Error ? error.message : "Server Error.")
            }
        })
    }

    return router;
}

export {RedisMiddleware, RedisRouter};

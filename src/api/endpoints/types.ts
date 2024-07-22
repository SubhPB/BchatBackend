
import { Request, Response, NextFunction } from "express";

export const HTTPMethods = [
    '*', 'GET', 'POST', 'PUT', 'DELETE', 'PATCH'
] as const;

export type MiddlewareFunction = (req: Request, res: Response, next: NextFunction) => void

export interface APIMiddleware {
    [key: string] : MiddlewareFunction
}
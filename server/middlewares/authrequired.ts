import { RequestHandler } from "express";

export default function authRequired(): RequestHandler {
    return (req, res, next) => {
        if (req.isAuthenticated()) {
            return next();
        }

        res.status(401).json({
            error: "Unauthorized"
        })
    }
}
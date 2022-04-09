import log from "@libs/log";
import { ErrorRequestHandler } from "express";

export default function(): ErrorRequestHandler {
    return (err, req, res, next) => {
        if (err.name === "ValidationError") {
            res.status(400).json({
                error: err.message
            })
        } else if (err.code === 11000) {
            res.status(400).json({
                error: "Duplicate key",
                fields: Object.keys(err.keyValue)
            })
        } else {
            // TODO: hide error message for production
            log.warn(`Error occured while handling request (${req.method} ${req.originalUrl})`);
            log.warn(err)
            res.status(500).json({
                error: err
            })
        }
    }
}
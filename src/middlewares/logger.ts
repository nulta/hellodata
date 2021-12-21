import type {RequestHandler} from "express"
import log from "@libs/log"
import color from "@libs/ansicolor"

function getRequestTime(start: [number, number]): number {
    const NS_PER_SEC = 1e9 // to convert sec to nanoseconds
    const NS_TO_MS = 1e6   // to convert ns to milliseconds
    const diff = process.hrtime(start)
    const time = (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS
    return Math.round(time * 100) / 100
};

function formatReqTime(reqTime: number): string {
    let reqTimeStr = reqTime.toFixed(2)
    
    if (reqTime < 10) {
        reqTimeStr = ""
    } else if (reqTime < 100) {
        reqTimeStr = `${color.DimGrey}${reqTimeStr}ms${color.Reset}`
    } else if (reqTime < 200) {
        reqTimeStr = `${color.Dim}${color.Yellow}${reqTimeStr}ms${color.Reset}`
    } else {
        reqTimeStr = `${color.Dim}${color.Red}${reqTimeStr}ms${color.Reset}`
    }
    return reqTimeStr
}

function formatStatusCode(statusCode: number): string {
    let statusCodeStr = statusCode.toString()
    
    if (statusCode <= 199)       // 1xx - Informational
        return `${color.DimGrey}${statusCodeStr}${color.Reset}`

    else if (statusCode <= 299)  // 2xx - Success
        return `${color.Green}${statusCodeStr}${color.Reset}`
    
    else if (statusCode == 304)  // 304 - Not Modified
        return `${color.DimGrey}${statusCodeStr}${color.Reset}`

    else if (statusCode <= 399)  // 3xx - Redirection
        return `${color.Yellow}${statusCodeStr}${color.Reset}`

    else if (statusCode <= 499)  // 4xx - Client Error
        return `${color.Yellow}${statusCodeStr}${color.Reset}`

    else if (statusCode <= 599)  // 5xx - Server Error
        return `${color.Red}${statusCodeStr}${color.Reset}`
    
    else                         // over 6xx - Unknown
        return `${color.Red}${statusCodeStr}${color.Reset}`
}

function formatMethod(method: string): string {
    if (method === "GET")
        return `${color.Green}${method} ${color.Reset}`
    else if (method === "POST")
        return `${color.Dim}${color.Yellow}${method}${color.Reset}`
    else if (method === "PUT")
        return `${color.Cyan}${method} ${color.Reset}`
    else if (method === "DELETE")
        return `${color.Red}${method}${color.Reset}`
    else if (method === "PATCH")
        return `${color.Magenta}${method}${color.Reset}`
    else
        return `${color.DimGrey}${method}${color.Reset}`
}
let ignorePaths: {[index: string]: boolean} = {
    "/favicon.ico": true,
}

export default function(): RequestHandler {
    return (req, res, next) => {
        if (ignorePaths[req.path]) {
            next()
            return
        }

        let time = process.hrtime();
        res.on("finish", () => {
            let reqTime = formatReqTime(getRequestTime(time))
            log.info(`${color.DimGrey}${req.ip}${color.Reset} ${formatMethod(req.method)} ${formatStatusCode(res.statusCode)} ${req.originalUrl} ${reqTime}`)
        })
        next()
    }
}
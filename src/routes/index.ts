import fs from "fs"
import path from "path"
import log from "@libs/log"
import {Router} from "express"
const router = Router()

router.get("/", (req, res) => {
    res.json({
        message: "Hello World",
    })
})

// Iterate over all routes and export them
const routerPath = __dirname
const currentFile = path.basename(__filename);
fs.readdirSync(routerPath).forEach(file => {
    if (file.endsWith(".ts") || file.endsWith(".js")) {
        if (file === currentFile)
            return
        log.info("Loading route: " + file)
        const route = require(path.join(routerPath, file))
        router.use("/", route.default)
    }
})

export default router
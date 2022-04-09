import fs from "fs"
import path from "path"
import log from "@libs/log"

// Iterate over all models and require them
const routerPath = __dirname
const currentFile = path.basename(__filename);
fs.readdirSync(routerPath).forEach(file => {
    if (file.endsWith(".ts") || file.endsWith(".js")) {
        if (file === currentFile)
            return
        log.info("Loading model: " + file)
        require(path.join(routerPath, file))
    }
})
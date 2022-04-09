import log from "@libs/log"
import config from "@utils/config"
import mongoose from "mongoose"

if (mongoose.connection && mongoose.connection.readyState !== 0) {
    // Connection is already open??
    throw new Error("Mongoose is already connected. Could be connected to another database.")
}

mongoose.connect(config.db.connection, {
    appName: config.db.appname,
    auth: config.db.auth,
    dbName: config.db.database,
}).catch()

let db = mongoose.connection
db.on("error", (error) => {
    log.error("MongoDB Connection Error!")
    log.error(error)
})
db.once("open", ()=> {
    log.info("Successfully connected to database.")
})

// export default db
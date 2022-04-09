import config from "@utils/config"  // Initialize config
import "@utils/init_database"       // Initialize database
import "@utils/init_passport"       // Initialize passport
import express from "express"
import log from "@libs/log"
import api_router from "@routes"
import log_middleware from '@middlewares/logger'
import errorhandler_middleware from '@middlewares/errorhandler'
import passport from "passport"
import session from "express-session"
import path from "path"
import static_router from "@routes/static"

const app = express()
app.use(express.json())
app.use(session({
    secret: config.session.secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: config.session.maxAge,
        httpOnly: true,
        secure: config.session.secure,
    }
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(log_middleware())
app.use("/api/", api_router)
app.use("/", static_router)
app.use("/", express.static(path.resolve(__dirname, "../client"), {extensions:["html"]}))
app.use(errorhandler_middleware())

app.listen(config.server_port, config.server_host, () => {
    log.info(`Server started on ${config.server_host}:${config.server_port}`)
})
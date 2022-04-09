import dotenv from "dotenv"
import { nanoid } from "nanoid"
dotenv.config()

const config = {
    server_port: parseInt(process.env.SERVER_PORT || "3000"),
    server_host: process.env.SERVER_HOST || "localhost",
    db: {
        connection: process.env.DB_CONNECTION || "mongodb://localhost:27017/",
        database: process.env.DB_DATABASE || "helloData",
        appname: process.env.DB_APPNAME || "HelloData",

        // Conditionally append auth credentials
        ...(process.env.DB_USER && {
            auth: {
                username: process.env.DB_USER,
                password: process.env.DB_PASSWORD
            }
        }),
    },
    session: {
        // Generate a random secret if not set
        secret: process.env.SESSION_SECRET || nanoid(50),
        maxAge: parseInt(process.env.SESSION_MAX_AGE || 60*60*24*7+""),
        secure: process.env.SESSION_SECURE === "true",
    }
}

Object.freeze(config)

export default config
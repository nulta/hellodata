import { MongoMemoryServer } from "mongodb-memory-server"
import mongoose from "mongoose"

let mongod = new MongoMemoryServer()

if (mongoose.connection && mongoose.connection.readyState !== 0) {
    // Connection is already open??
    throw new Error("Mongoose is already connected. Could be connected to production database.")
}

export async function connect() {
    await mongod.start()
    const uri = mongod.getUri()
    await mongoose.connect(uri, {
        dbName: "test_helloData",
    })
}

export async function close() {
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
    await mongod.stop()
}

export async function resetData() {
    const collections = mongoose.connection.collections
    for (const key in collections) {
        const collection = collections[key]
        await collection.deleteMany({})
    }
}

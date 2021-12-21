import assert from "assert/strict"
import mongoose from "mongoose"
import { nanoid } from "nanoid"
import is_valid_nanoid from "@libs/is_valid_nanoid"
import filterObject from "@libs/filter_object"
import * as virtualdb from "./helpers/virtual_db"

describe("Utils and Libraries", ()=>{

    // nanoid
    describe("nanoid", ()=>{
        it("should validate well", ()=>{
            for (let i = 0; i < 100; i++) {
                const id = nanoid(6)
                assert(is_valid_nanoid(id, 6))
            }
        })

        it("should have enough uniqueness", ()=>{
            const ids = new Set()
            for (let i = 0; i < 100; i++) {
                const id = nanoid(6)
                assert(!ids.has(id))
                ids.add(id)
            }
        })
    })

    // filter_object
    describe("filter_object", ()=>{
        it("should filter keys", ()=>{
            assert.deepEqual(
                filterObject({a: 1,b: 2,c: "3",d: "4",e: {f:"5"}},["a", "c", "e"]),
                {a: 1,c: "3",e:{f:"5"}}
            )
        })
    })

    // virtual_db
    describe("virtual_db", () => {
        it("should be available on mongoose", ()=>{
            assert.equal(mongoose.connection.readyState, 1)
            assert(mongoose.connection.db.databaseName.startsWith("test_"))
        })
    
        it("should be able to reset the data", async ()=>{
            await mongoose.connection.collection("test1").insertOne({a: 1})
            await mongoose.connection.collection("test1").insertOne({a: 2})
            await mongoose.connection.collection("test1").insertOne({a: 3})
    
            await virtualdb.resetData()
            
            let count = await mongoose.connection.collection("test1").countDocuments()
            assert(count === 0)
        })
    })
})
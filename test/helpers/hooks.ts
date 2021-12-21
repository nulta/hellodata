import * as virtualdb from "./virtual_db"

export const mochaHooks = {
    async beforeAll() {
        await virtualdb.connect()
    },

    async afterAll() {
        await virtualdb.close()
    },

    async afterEach() {
        await virtualdb.resetData()
    }
}
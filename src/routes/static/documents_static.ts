import express from "express"
import path from "path"
const router = express.Router()

/**
 * GET /projects/:projectId
 */
router.get("/projects/:projectId", (req, res) => {
    res.sendFile(path.resolve(__dirname,"../../../client/project.htm"))
})

export default router
import Project from "@models/project"
import {Router} from "express"
import log from "@libs/log"
import filterObject from "@libs/filter_object"
import { IProject } from "@classes/IProject"
const router = Router()

/**
 * GET /api/projects
 * Get all public projects' information
 */
router.get("/projects", (req, res, next) => {
    Project.find()
        .where("public").equals(true)
        .select("_id name desc public owner")
        .populate("owner", "name")
        .then(projects => {
            res.json(projects)
        })
        .catch(next)
})

/**
 * POST /api/projects
 * Create a new project
 */
router.post("/projects", (req, res, next) => {
    Project.createProject({
        name: req.body.name,
        desc: req.body.desc,
        owner: req.body.owner,
        public: req.body.public
    }).then(project => {
        res.json(project)
    }).catch(next)

})

/**
 * GET /api/projects/:id
 * Get a project
 */
router.get("/projects/:id", (req, res, next) => {
    Project.findById(req.params.id)
        .select("_id name desc public owner members documents meta createdAt updatedAt")
        .then(project => {
            // TODO: match coding styles
            if (!project)
                return res.status(404).json({error: "Project not found"})

            res.json(project)
        }).catch(next)
})

/**
 * PATCH /api/projects/:id
 * Update a project
 */
router.patch("/projects/:id", (req, res, next) => {
    req.body = filterObject(req.body, ["name", "desc", "public", "meta"])
    Project.findByIdAndUpdate(req.params.id, req.body, {new: true}).then(project => {
        if (!project) {
            res.status(404).json({
                error: "Project not found"
            })
            return
        }

        res.json(project)
    }).catch(next)
})

export default router
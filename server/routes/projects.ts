import Project from "@models/project"
import {Router} from "express"
import log from "@libs/log"
import filterObject from "@libs/filter_object"
import { IProject } from "@classes/IProject"
import authRequired from "@middlewares/authrequired"
const router = Router()

/**
 * GET /api/projects
 * Get all public projects' information.
 * If the user is authenticated, get all projects' information.
 */
router.get("/projects", (req, res, next) => {
    if (req.user) {
        Project.find({
            $or: [
                { private: false },
                { owner: req.user._id }
            ]
        })
            .select("_id name desc public owner")
            .populate("owner", "name")
            .then(projects => {
                res.json(projects)
            })
            .catch(next)
    } else {
        Project.find()
            .where("public").equals(true)
            .select("_id name desc public owner")
            .populate("owner", "name")
            .then(projects => {
                res.json(projects)
            })
            .catch(next)
    }
})

/**
 * POST /api/projects
 * Create a new project
 */
router.post("/projects", authRequired(), (req, res, next) => {
    Project.createProject({
        name: req.body.name,
        desc: req.body.desc,
        owner: req.user!._id,
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
            if (!project)
                return res.status(404).json({error: "Project not found"})

            res.json(project)
        }).catch(next)
})

/**
 * PATCH /api/projects/:id
 * Update a project
 */
router.patch("/projects/:id", authRequired(), (req, res, next) => {
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
import Document from "@models/document"
import Project from "@models/project"
import {Router} from "express"
import filterObject from "@libs/filter_object"
import authRequired from "@middlewares/authrequired"
const router = Router()

// /api/projects/:projectId/documents/:documentId

/**
 * POST /api/projects/:projectId/documents
 * Create a new document on a project
 */
router.post("/projects/:projectId/documents", authRequired(), (req, res, next) => {
    Document.createDocument({
        projectId: req.params.projectId,
        name: req.body.name,
        path: req.body.path,
        type: req.body.type,
        content: req.body.content,
        meta: req.body.meta,

        createdBy: req.user!._id,
        updatedBy: req.user!._id,
    }).then(document => {
        res.json(document)
    }).catch(next)
})

/**
 * GET /api/projects/:projectId/documents
 * Get all documents as object, except content
 */
router.get("/projects/:projectId/documents", (req, res, next) => {
    const projectId = req.params.projectId

    Project.findById(projectId)
        .populate("documents", "name path type meta")
        // .select("documents")
        .then(project => {
            if (!project)
                return res.status(404).json({error: "Project not found"})

            res.json(project.documents)
        }).catch(next)
})

/**
 * GET /api/projects/:projectId/documents/:documentId
 * Get a document
 */
router.get("/projects/:projectId/documents/:documentId", (req, res, next) => {
    const projectId = req.params.projectId
    const documentId = req.params.documentId

    const projectDocumentId = `${projectId}/${documentId}`
    Document.findById(projectDocumentId).then(document => {
        if (!document) {
            res.status(404).json({
                error: "Document not found"
            })
            return
        }
        res.json(document)
    }).catch(next)
})

/**
 * PATCH /projects/:projectId/documents/:documentId
 * Update a document
 */
router.patch("/projects/:projectId/documents/:documentId", authRequired(), (req, res, next) => {
    const projectId = req.params.projectId
    const documentId = req.params.documentId
    const projectDocumentId = `${projectId}/${documentId}`

    // Sanitize req.body
    req.body = filterObject(req.body, ["name", "path", "content", "meta"])
    req.body.updatedBy = req.user!._id

    Document.findByIdAndUpdate(projectDocumentId, req.body, {new: true})
        .select("_id name path type content meta")
        .then(document => {
            if (!document) {
                res.status(404).json({
                    error: "Document not found"
                })
                return
            }

            // filtered with select()
            res.json(document)
        }).catch(next)
})

/**
 * DELETE /projects/:projectId/documents/:documentId
 * Delete a document
 */
router.delete("/projects/:projectId/documents/:documentId", authRequired(), (req, res, next) => {
    const projectId = req.params.projectId
    const documentId = req.params.documentId
    const projectDocumentId = `${projectId}/${documentId}`

    Document.findByIdAndDelete(projectDocumentId).then(document => {
        res.json({ok: true})
    }).catch(next)
})

export default router
import {Router} from "express"
import log from "@libs/log"
import filterObject from "@libs/filter_object"
import User from "@models/user"
const router = Router()

// TODO: Authentication

/**
 * GET /api/users
 * Get all users' information
 * ! Should not be present in production.
 */
router.get("/users", (req, res, next) => {
    User.find()
        .select("_id name email avatar")
        .then(users => {
            res.json(users)
        })
        .catch(next)
        
})

/**
 * GET /api/users/verbose
 * Get all users' information with more information
 * ! Should not be present in production.
 */
router.get("/users/verbose", (req, res, next) => {
    User.find()
        .then(users => {
            res.json(users)
        })
        .catch(next)
        
})

/**
 * GET /api/users/:id
 * Get a user
 */
router.get("/users/:id", (req, res, next) => {
    User.findById(req.params.id).then(user => {
        if (!user) {
            res.status(404).json({
                error: "User not found"
            })
            return
        }
        res.json(user.getPublicInformations())
    }).catch(next)
})

/**
 * PATCH /api/users/:id
 * Update a user
 */
router.patch("/users/:id", (req, res, next) => {
    req.body = filterObject(req.body, ["name", "email", "password", "avatar", "meta"])
    User.findByIdAndUpdate(req.params.id, req.body, {new: true})
    .select("_id name email avatar meta")
    .then(user => {
        if (!user) {
            res.status(404).json({
                error: "User not found"
            })
            return
        }

        // filtered with select()
        res.json(user)
    }).catch(next)
})

export default router
import {Router} from "express"
import log from "@libs/log"
import filterObject from "@libs/filter_object"
import User from "@models/user"
const router = Router()

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
    if (req.user?._id != req.params.id) {
        return res.status(403).json({
            error: "Cannot update other users"
        })
    }

    req.body = filterObject(req.body, ["name", "password", "avatar", "meta"])
    User.findByIdAndUpdate(req.params.id, req.body, {new: true})
    .select("_id name email avatar meta")
    .then(user => {
        if (!user) {
            res.status(404).json({
                error: "User not found"
            })
            return
        }

        // Update the user session
        req.session.passport.user.name = user.name
        req.session.passport.user.meta = user.meta

        // filtered with select()
        res.json(user)
    }).catch(next)
})

export default router
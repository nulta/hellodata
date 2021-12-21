import {Router} from "express"
import log from "@libs/log"
import filterObject from "@libs/filter_object"
import authRequired from "@middlewares/authrequired"
import passport from "passport"
import config from "@utils/config"
import User from "@models/user"
const router = Router()
/**
 * POST /api/auth/logout
 * Logout the current user
 */
router.post("/auth/logout", authRequired(), (req, res) => {
    req.logout()
    res.json({
        success: true
    })
})

/**
 * POST /api/auth/login
 * Login the user and return the user information
 * Session and cookies are set here
 */
// TODO: Anti-bruteforce
router.post("/auth/login", passport.authenticate("local"), (req, res) => {
    res.json({
        success: true,
        user: filterObject(req.user!, ["_id", "username", "email", "avatar", "meta"])
    })
})

/**
 * POST /api/auth/register
 * Register the user and return the user information
 */
router.post("/auth/register", (req, res, next) => {
    User.createUser({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        avatar: req.body.avatar,
        meta: req.body.meta
    }).then(user => {
        res.json({
            success: true,
            user: filterObject(req.user!, ["_id", "username", "email", "avatar", "meta"])
        })
    }).catch(next)
})


export default router
import passport from "passport"
import { Strategy as LocalStrategy } from "passport-local"
import User from "@models/user"
import bcrypt from "bcrypt"

passport.use("local", new LocalStrategy({
    usernameField: "email",
    passwordField: "password",
}, (email, password, done) => {
    User.findOne()
        .where("email", email)
        .then(async user => {
            if (!user)
                return done(null, false, { message: "Incorrect email or password" })

            const passwordCorrect = await user.comparePassword(password)
            if (!passwordCorrect)
                return done(null, false, { message: "Incorrect email or password" })

            const sessionData = {
                _id: user._id,
                name: user.name,
                email: user.email,
                meta: user.meta
            }
            return done(null, sessionData)
        })
}))

passport.serializeUser((user, done) => {
    done(null, user)
})

passport.deserializeUser((user, done) => {
    done(null, {user})
})

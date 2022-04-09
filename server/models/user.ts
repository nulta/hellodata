import mongoose, { Schema, Document as MongooseDocument } from "mongoose"
import { IUser, IUserModel, UserPublicInfo } from "@classes/IUser"
import { UserCreateFields } from "@classes/FieldTypes"
import { nanoid } from "nanoid"
import bcrypt from "bcrypt"

const User = new mongoose.Schema({
    _id: {
        type: String,
        match: [/^[0-9a-zA-Z-_]{6}$/, "Invalid User ID"]
    },


    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 40,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Invalid Email"]
    },
    password: {
        // bcrypted password
        type: String,
        required: true
    },
    avatar: {
        type: String,
        // default: ?
    },

    meta: {
        type: Schema.Types.Mixed,
        default: {},
        validate: (value: any) => typeof value === "object"
    },
}, {
    timestamps: true,
})

function isValidPassword(password: string): [boolean, string] {
    if (password.length < 8)
        return [false, "Password must be at least 8 characters"]
    if (password.length > 1000)
        return [false, "Password must not be longer than 1000 characters"]
    if (/^[0-9]+$/.test(password))
        return [false, "Password must not be all number"]
    if (password.trim() === "")
        return [false, "Password must not be all whitespace"]
    return [true, ""]
}
User.statics.isValidPassword = isValidPassword

User.statics.createUser = async function(data: UserCreateFields): Promise<IUser & MongooseDocument> {
    let {name, email, password, avatar, meta} = data
    let id

    // Password Check
    if (!isValidPassword(password)[0]) {
        let err = new Error(isValidPassword(password)[1])
        err.name = "ValidationError"
        throw err
    }
    if (password === email || password === name) {
        let err = new Error("Password and name/email must not be same")
        err.name = "ValidationError"
        throw err
    }

    // Generate ID (maximum 10 tries)
    for (let i = 0; i < 10; i++) {
        id = nanoid(6)
        if (!await this.exists({_id: id}))
            break
        else
            id = null
    }
    if (!id) {
        throw new Error("Failed to generate user ID (too many collisions)")
    }

    // Hash the password
    await bcrypt.hash(password, 10).then(hash => { password = hash })

    // Create User
    const doc = new this({
        _id: id,
        name: name,
        email: email,
        password: password,
        avatar: avatar,
        meta: meta || {}
    })
    await doc.save()
    return doc
}

User.methods.comparePassword = async function(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password)
}

User.methods.setPassword = async function(password: string): Promise<void> {
    await bcrypt.hash(password, 10).then(hash => { this.password = hash })
    await this.save()
}

User.methods.getPublicInformations = function(this: IUser): UserPublicInfo {
    return {
        _id: this._id,
        name: this.name,
        avatar: this.avatar,
        meta: this.meta
    }
}

export default mongoose.connection.model<IUser & MongooseDocument, IUserModel>("User", User)
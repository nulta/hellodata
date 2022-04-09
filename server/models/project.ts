import mongoose, { Schema, Document as MongooseDocument } from "mongoose"
import { IProject, IProjectModel } from "@classes/IProject"
import { nanoid } from "nanoid"
import { ProjectCreateFields } from "@classes/FieldTypes"

const Project = new mongoose.Schema({
    _id: {
        type: String,
        match: [/^[0-9a-zA-Z-_]{6}$/, "Invalid Project ID"]
    },

    name: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
        default: "",
        maxlength: [4096, "Description is too long"]
    },

    public: {
        type: Boolean,
        default: false,
    },

    owner: {
        type: String,
        ref: "User"
    },
    members: [{
        type: String,
        ref: "User"
    }],

    documents: [{
        type: String,
        ref: "Document"
    }],

    meta: {
        type: Schema.Types.Mixed,
        default: {}
    },
}, {
    timestamps: true,
})

Project.statics.createProject = async function(data: ProjectCreateFields): Promise<IProject & MongooseDocument> {
    let {name, desc, owner, meta} = data
    let isPublic = !!data.public
    let id

    // Generate ID (maximum 10 tries)
    for (let i = 0; i < 10; i++) {
        id = nanoid(6)
        if (!await this.exists({_id: id}))
            break
        else
            id = null
    }
    if (!id) {
        throw new Error("Failed to generate project ID (too many collisions)")
    }

    const doc = new this({
        _id: id,
        name: name,
        desc: desc || "",
        public: isPublic,
        owner: owner,
        members: owner ? [owner] : [],
        documents: [],
        meta: meta || {}
    })
    await doc.save()
    return doc
}

export default mongoose.connection.model<IProject & MongooseDocument, IProjectModel>("Project", Project)
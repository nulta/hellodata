import mongoose, { Schema, Document as MongooseDocument, Types } from "mongoose"
import { IDocument, IDocumentModel } from "@classes/IDocument"
import DocumentType from "@classes/DocumentType"
import { nanoid } from "nanoid"
import IsValidNanoID from "@libs/is_valid_nanoid"
import assert from "assert/strict"
import { DocumentCreateFields } from "@classes/FieldTypes"
import Project from "@models/project"

function isValidDocumentName(name: string): boolean {
    name = name.trim()
    if (name == "")
        return false
    if (name.includes("/") || name.includes("\\"))
        return false
    if (name.length > 100)
        return false
    return true
}

const Document = new mongoose.Schema({
    _id: {
        type: String,
        match: [/^[0-9a-zA-Z-_]{6}\/[0-9a-zA-Z-_]{4}$/, "Invalid document ID"]
    },

    
    name: {
        type: String,
        required: true,
        index: true,
        trim: true,
        validate: {
            validator: isValidDocumentName,
            message: "Invalid document name"
        }
    },
    path: {
        type: String,
        default: "/",
        trim: true,
        lowercase: true,
        match: [/^\/([a-z0-9-_\/]+?\/)?$/, "Invalid document path"],
        maxlength: [255, "Document path is too long"]
    },
    type: {
        type: String,
        required: true,
        enum: Object.keys(DocumentType)
    },
    

    createdBy: {
        type: String,
        ref: "User",
    },
    updatedBy: {
        type: String,
        ref: "User",
    },
    

    content: {
        type: String,
        default: ""
    },
    meta: {
        type: Schema.Types.Mixed,
        default: {}
    },
}, {
    timestamps: true,
})

Document.virtual("projectId").get(function(this: IDocument):string {
    return this._id.split("/")[0]
})

// Path + name must be unique
Document.index({name: 1, path: 1, projectId: 1}, {unique: true})

Document.statics.createDocument = async function(data: DocumentCreateFields): Promise<IDocument & MongooseDocument> {
    let {projectId, name, path, type, content, meta} = data
    let id
    assert(IsValidNanoID(projectId, 6), "Invalid project ID")
    let project = await Project.findById(projectId)
    assert(project, "Project not found")

    // Generate ID (maximum 10 tries)
    for (let i = 0; i < 10; i++) {
        id = nanoid(4)
        id = `${projectId}/${id}`
        if (!await this.exists({_id: id}))
            break
        else
            id = null
    }
    if (!id) {
        throw new Error("Failed to generate document ID (too many collisions)")
    }

    // Create document
    const doc = new this({
        _id: id,
        name: name,
        path: path || "/",
        type: type,
        content: content || "",
        meta: meta || {},
    })
    await doc.save()

    // Add a reference to the project
    project.documents.push(doc._id)
    await project.save()

    return doc
}

// TODO: Add a method to delete document (don't forget to remove reference from project)


const model = mongoose.connection.model<IDocument & MongooseDocument, IDocumentModel>("Document", Document)
export default model
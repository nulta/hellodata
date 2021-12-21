import DocumentType from "@classes/DocumentType"
import { Model, Document as MongooseDocument } from "mongoose";
import { DocumentCreateFields } from "./FieldTypes"

export interface IDocument {
    readonly _id: string
    name: string
    path: string
    type: DocumentType
    createdBy?: String  // => User
    updatedBy?: String  // => User
    content: string
    meta: Record<any, any>
    createdAt: Date
    updatedAt: Date

    // virtuals
    readonly projectId: string
}

// Static Methods
export interface IDocumentModel extends Model<IDocument> {
    createDocument(data: DocumentCreateFields): Promise<IDocument & MongooseDocument>
}
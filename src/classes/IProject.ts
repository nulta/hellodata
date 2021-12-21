import { Model, Document as MongooseDocument } from "mongoose";
import { ProjectCreateFields } from "./FieldTypes";

export interface IProject {
    readonly _id: string
    name: string
    desc: string
    public: boolean
    owner?: String       // => User
    members: String[]    // => User
    documents: String[]  // => Document
    meta: Record<any, any>
    createdAt: Date
    updatedAt: Date
}

// Static Methods
export interface IProjectModel extends Model<IProject> {
    createProject(data: ProjectCreateFields): Promise<IProject & MongooseDocument>
}

// To display in the project list
// used in GET /api/projects
export type ProjectDisplayData = {
    _id: string
    name: string
    desc: string
    public: boolean
    owner: {
        name: string
    }
}
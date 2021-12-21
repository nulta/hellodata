import { Model, Document as MongooseDocument } from "mongoose";
import { UserCreateFields } from "./FieldTypes";

export interface IUser {
    readonly _id: string
    name: string
    email: string
    password: string  // Hashed w/bcrypt
    avatar: string    // URL to image
    meta: Record<any, any>
    createdAt: Date
    updatedAt: Date
    
    // Methods
    comparePassword(password: string): Promise<boolean>
    setPassword(password: string): Promise<void>
    getPublicInformations(): UserPublicInfo
}

export type UserPublicInfo = {
    _id: string
    name: string
    avatar: string
    meta: Record<any, any>
}

// Static Methods
export interface IUserModel extends Model<IUser> {
    createUser(data: UserCreateFields): Promise<IUser & MongooseDocument>
}
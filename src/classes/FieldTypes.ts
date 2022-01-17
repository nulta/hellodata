export type DocumentCreateFields = {
    projectId: string,
    name: string
    path?: string
    type: DocumentType
    content?: string
    meta?: Record<any,any>
    createdBy?: string
    updatedBy?: string
}

export type ProjectCreateFields = {
    name: string
    desc?: string
    public?: boolean
    owner?: string
    meta?: Record<any,any>
}

export type UserCreateFields = {
    name: string
    email: string
    password: string
    avatar?: string
    meta?: Record<any,any>
}
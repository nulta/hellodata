
namespace Express {
    interface Request {
        user?: {
            _id: string,
            name: string,
            email: string,
            meta: Record<any,any>
        }

        session: {
            passport: {
                user: {
                    _id: string,
                    name: string,
                    email: string,
                    meta: Record<any,any>
                }
            }
        }
    }
}
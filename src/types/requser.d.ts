
namespace Express {
    interface Request {
        user?: {
            _id: string,
            name: string,
            email: string,
            meta: Record<any,any>
        }
    }
}
import { PrismaClient } from "@prisma/client"
import { Request, Response, NextFunction } from "express"
import { verify } from "jsonwebtoken"
const prisma = new PrismaClient()
interface CustomRequest extends Request {
    id?: string;
}
export const UserAuthen = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const authorization = req.headers['authorization']
    const token = authorization && authorization.split(" ")[1]

    if (token && process.env.SECRETTOKEN) {

        try {
            const result = verify(token, process.env.SECRETTOKEN)

            if (typeof result === 'object' && 'id' in result) {

                const user = await prisma.user.findFirst({ where: { "id": Number(result.id) }, select: { position: true } })

                if (user?.position === "user" || user?.position === "admin") {
                    req.id = result.id
                    next()
                    // res.json(result.id)
                }

            } else {
                res.json({
                    success: false,
                    msg: "you dont have permission"
                })

            }
        } catch (error) {
            res.json({
                success: false,
                msg: "your token is expired"
            })
        }


    } else {
        res.json({
            success: false,
            msg: "you dont log in"
        })
    }
}

export const AdminAuthen = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const authorization = req.headers['authorization']
    const token = authorization && authorization.split(" ")[1]

    if (token && process.env.SECRETTOKEN) {

        const result = verify(token, process.env.SECRETTOKEN)

        if (typeof result === 'object' && 'id' in result) {

            const user = await prisma.user.findFirst({ where: { "id": Number(result.id) }, select: { position: true } })

            if (user?.position === "admin") {
                req.id = result.id
                next()
            } else {
                res.json({
                    success: false,
                    msg: "you dont have permission"
                })
            }

        } else {
            res.json({
                success: false,
                msg: "you dont have permission"
            })

        }
    } else {
        res.json({
            success: false,
            msg: "you dont log in"
        })
    }
}
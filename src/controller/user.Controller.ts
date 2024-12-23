import { Request, Response } from "express"
import { PrismaClient } from "@prisma/client"
import { genSaltSync, hashSync } from "bcryptjs";

const prisma = new PrismaClient();
let outPut: any = {}
interface CustomRequest extends Request {
    id?: string;
}
export const GetUserController = async (req: CustomRequest, res: Response) => {
    const user = await prisma.user.findFirst({
        include: {
            avata: true,
            cover: true,
        },
        where: {
            id: Number(req.id)
        },

    })
    if (user?.id) {
        const { id, username, email, avata, cover, position } = user
        outPut.success = true
        outPut.data = { id, username, email, avata, cover, position }
        res.json(outPut)
    } else {
        outPut.success = false
        outPut.message = "this user is not existed"
        res.json(outPut)
    }
}
export const UpdateUserController = async (req: CustomRequest, res: Response) => {

    const id = req.id
    const body = req.body
    const salt = genSaltSync(10);
    const mahoa_password = req.body.password && hashSync(req.body.password.toString(), salt);
    body.password = mahoa_password

    const PageBody: any = {
        active: body.active,
        email: body.email,
        position: body.position,
        username: body.username,
        password: mahoa_password,
        coverId: Number(body.coverId),
        avataId: Number(body.avataId)

    }
    if (Number(id) === Number(req.query.id)) {
        await prisma.user.update({
            where: {
                id: Number(req.query.id)
            },
            data: PageBody
        }).catch((err) => {
            outPut.success = false
            outPut.message = "your updating user is fail"
            res.json(outPut)
            throw (err)
        }).then((data) => {
            outPut.success = true
            outPut.message = "your updating user is success"
            res.json(outPut)
        })

    } else {
        outPut.success = false
        outPut.message = "you aren't this user "
        res.json(outPut)
    }

}
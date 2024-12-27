import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient();

export const NotiFromServer = (msg: string, toId: number) => {

    prisma.notification.create({
        data: {
            content: msg,
            forUser: {
                create: {
                    forUser: {
                        connect: { id: Number(toId) }
                    }
                }
            }
        }
    }).catch((err) => {
        console.log(err)
    }).then((data) => {
        console.log(data)
    })
}
import { Request, Response } from "express";
import { genSaltSync, hashSync, compare } from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { transporter } from "../connect/mail";
import { sign } from "jsonwebtoken";

const prisma = new PrismaClient();

let outPut: any = {}

export const createAndSend = async (req: Request, res: Response) => {


    const body = req.body
    const salt = genSaltSync(10);
    const mahoa_password = req.body.password && hashSync(req.body.password.toString(), salt);
    body.password = mahoa_password

    const mainOptions = {
        from: 'LOCAND (ph.hoangloc@gmail.com) <no-reply>',
        to: req.body.email,
        subject: 'Active your Account',
        html: `
        <p style="text-align:center">Thanks for you registering!<p>
        <p style="text-align:center">To active the account click <a style="font-weight:bold;color:green" href="${process.env.NODE_APP_URL}api/active?email=${req.body.email}">here</a>!<p>`
    }

    try {
        prisma.$transaction(async tx => {
            await tx.user.create({ data: body })
            await transporter.sendMail(mainOptions)
        })
        outPut.success = true
        outPut.message = "please check your email to active your account"
        res.json(outPut)
    } catch (error) {
        outPut.success = false
        outPut.message = "your account cant be created"
        res.json(outPut)
    }


}

export const activeAccount = async (req: Request, res: Response) => {
    const email = req.query.email
    prisma.user.update({ where: { email: email?.toString() }, data: { active: true } })
        .catch((error) => {
            outPut.success = false
            outPut.msg = error.message
            res.json(outPut)
            throw error.message
        })
        .then(() => {
            outPut.success = true
            outPut.message = "your account have been actived"
            res.json(outPut)
        })

}

export const login = async (req: Request, res: Response) => {
    const username = req.body.username
    const password = req.body.password

    const usenameiExsited = await prisma.user.findUnique({ where: { username: username } })
    if (usenameiExsited == null) {

        outPut = {
            success: false,
            message: "account is not Existed",
        }

        res.json(outPut)

    } else {
        if (usenameiExsited.active === false) {

            outPut = {
                success: false,
                message: "account is not active",
            }

            res.json(outPut)

        } else {
            const isPasswordValid = await compare(password, usenameiExsited.password);
            if (isPasswordValid && process.env.SECRETTOKEN) {

                const payload = { id: usenameiExsited.id }

                const token = sign(payload, process.env.SECRETTOKEN, { expiresIn: '24h' });

                outPut = {
                    success: true,
                    message: "login successfull",
                    result: token,
                }

                res.json(outPut)


            } else {
                outPut = {
                    success: false,
                    message: "password is not correct",
                }

                res.json(outPut)
            }
        }
    }
}
export const checkuser = async (req: Request, res: Response) => {
    const query = req.query
    await prisma.user.findFirst({
        where: {
            'username': query.username?.toString(),
            'email': query.email?.toString()
        }
    })
        .catch((error) => {
            outPut.success = false
            outPut.message = error.message
            res.json(outPut)
            throw error.message
        })
        .then((data) => {
            if ((query.username || query.email) && data) {
                res.json(true)
            } else {
                res.json(false)
            }
        })
}
export const getCategoryController = async (req: Request, res: Response) => {
    const query = req.query
    await prisma.category.findMany({
        where: {
            archive: query.archive ? query.archive.toString() : undefined,
            id: query.id ? Number(query.id) : undefined,
        },
        skip: req.query.skip ? Number(req.query.skip) : undefined,
        take: req.query.limit ? Number(req.query.limit) : undefined,

    })
        .catch((error: Error) => {
            outPut.success = false
            outPut.message = error.message
            res.json(outPut)
        })
        .then((data) => {
            outPut.success = true
            outPut.data = data
            res.json(outPut)
        })
}
export const getBlogController = async (req: Request, res: Response) => {
    const query = req.query
    await prisma.blog.findMany({
        where: {
            archive: query.archive ? query.archive.toString() : undefined,
            id: query.id ? Number(query.id) : undefined,
            slug: query.slug ? query.slug.toString() : undefined,
            name: {
                contains: query.search ? query.search.toString() : undefined,
            },

        },
        include: {
            host: {
                select: {
                    id: true,
                    username: true
                }
            },
            cover: {
                select: {
                    id: true,
                    name: true
                }
            },
        },
        skip: req.query.skip ? Number(req.query.skip) : undefined,
        take: req.query.limit ? Number(req.query.limit) : undefined,
        orderBy: {
            createdAt: 'desc',
        },
    })
        .catch((error: Error) => {
            outPut.success = false
            outPut.message = error.message
            res.json(outPut)
        })
        .then((data) => {
            outPut.success = true
            outPut.data = data
            res.json(outPut)
        })
}
export const getBookController = async (req: Request, res: Response) => {
    const query = req.query
    await prisma.book.findMany({
        where: {
            archive: query.archive ? query.archive.toString() : undefined,
            id: query.id ? Number(query.id) : undefined,
            slug: query.slug ? query.slug.toString() : undefined,
            category: {
                name: query.category ? query.category.toString() : undefined
            },
            name: {
                contains: query.search ? query.search.toString() : undefined,
            },

        },
        include: {
            host: {
                select: {
                    id: true,
                    username: true
                }
            },
            cover: {
                select: {
                    id: true,
                    name: true
                }
            },
            category: {
                select: {
                    id: true,
                    name: true
                }
            },
            file: {
                select: {
                    id: true,
                    name: true
                }
            },
            chapter: true,
        },
        skip: req.query.skip ? Number(req.query.skip) : undefined,
        take: req.query.limit ? Number(req.query.limit) : undefined,
        orderBy: {
            createdAt: 'desc',
        },
    })
        .catch((error: Error) => {
            outPut.success = false
            outPut.message = error.message
            res.json(outPut)
        })
        .then((data) => {
            outPut.success = true
            outPut.data = data
            res.json(outPut)
        })
}
export const getPictureController = async (req: Request, res: Response) => {
    const query = req.query
    await prisma.pic.findMany({
        where: {
            id: query.id ? Number(query.id) : undefined
        },
        include: {
            host: {
                select: {
                    id: true,
                    username: true
                }
            },
        },

    })
        .catch((error: Error) => {
            outPut.success = false
            outPut.message = error.message
            res.json(outPut)
        })
        .then((data) => {
            outPut.success = true
            outPut.data = data
            res.json(outPut)
        })
}
export const getPageController = async (req: Request, res: Response) => {
    const query = req.query
    await prisma.page.findMany({
        where: {
            archive: query.archive ? query.archive.toString() : undefined,
            id: query.id ? Number(query.id) : undefined,
            slug: query.slug ? query.slug.toString() : undefined,
        },
        include: {
            host: {
                select: {
                    id: true,
                    username: true
                }
            },
            cover: true
        },
        skip: req.query.skip ? Number(req.query.skip) : undefined,
        take: req.query.limit ? Number(req.query.limit) : undefined,
        orderBy: {
            createdAt: 'desc',
        },
    })
        .catch((error: Error) => {
            outPut.success = false
            outPut.message = error.message
            res.json(outPut)
        })
        .then((data) => {
            outPut.success = true
            outPut.data = data
            res.json(outPut)
        })
}
import { Request, Response } from "express"
import { PrismaClient } from "@prisma/client"
import { genSaltSync, hashSync } from "bcryptjs";
import { IncomingForm } from 'formidable'
import Client from "ssh2-sftp-client"
import { sftpConfig } from "../connect/sftp";
import moment from "moment";
const prisma = new PrismaClient();
let outPut: any = {}
interface CustomRequest extends Request {
    id?: string;
}
export const GetAdminController = async (req: CustomRequest, res: Response) => {
    const users = await prisma.user.findMany({
        include: {
            avata: true,
            cover: true,
        },
    })
    const [{ id, archive, username, email, avataId, coverId, position, active }] = users
    outPut.success = true
    outPut.data = [{ id, archive, username, email, avataId, coverId, position, active }]
    res.json(outPut)
}
export const GetOneAdminController = async (req: CustomRequest, res: Response) => {
    const users = await prisma.user.findMany({
        include: {
            avata: true,
            cover: true,
        },
        where: {
            id: Number(req.id)
        },
    })
    const [{ id, archive, username, email, avataId, coverId, position, active }] = users
    outPut.success = true
    outPut.data = { id, archive, username, email, avataId, coverId, position, active }
    res.json(outPut)
}
export const UpdateAdminController = async (req: CustomRequest, res: Response) => {

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


}
export const PostCategoryController = async (req: CustomRequest, res: Response) => {
    const body = req.body
    const CategoryBody: any = {
        name: body.name,
    }

    await prisma.category.create({ data: CategoryBody })
        .catch((err) => {
            outPut.success = false
            outPut.message = "your category is created fail"
            res.json(outPut)
            throw (err)
        }).then((data) => {
            outPut.success = true
            outPut.message = "your category is created successfull"
            res.json(outPut)
        })
}
export const UpdateCategoryController = async (req: CustomRequest, res: Response) => {

    const query = req.query
    const body = req.body
    const CategoryBody: any = {
        name: body.name,
    }

    await prisma.category.update({ where: { id: Number(query.id) }, data: CategoryBody })
        .catch((err) => {
            outPut.success = false
            outPut.message = "your updating category is fail"
            res.json(outPut)
        }).then((data) => {
            outPut.success = true
            outPut.message = "your updating category is success"
            res.json(outPut)
        })

}
export const DeleteCategoryController = async (req: CustomRequest, res: Response) => {
    const query = req.query

    await prisma.category.delete({ where: { id: Number(query.id) } })
        .catch((err) => {
            outPut.success = false
            outPut.message = "your category is deleted fail"
            res.json(outPut)
            throw (err)
        }).then((data) => {
            outPut.success = true
            outPut.message = "your category is deleted success"
            res.json(outPut)
        })
}
export const GetBlogController = async (req: Request, res: Response) => {
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
export const PostBlogController = async (req: CustomRequest, res: Response) => {
    const body = req.body
    const BlogBody: any = {
        id: body.id,
        name: body.name,
        slug: body.slug,
        host: {
            connect: { id: Number(req.id) }
        },
        content: body.content,
        infor: body.infor,
        cover: {
            connect: {
                id: Number(body.coverId)
            }
        },
    }

    await prisma.blog.create({ data: BlogBody })
        .catch((err) => {
            outPut.success = false
            outPut.message = "your creating blog is fail"
            res.json(outPut)
            throw (err)
        }).then((data) => {
            outPut.success = true
            outPut.message = "your creating blog is success"
            res.json(outPut)
        })
}
export const UpdateBlogController = async (req: CustomRequest, res: Response) => {

    const query = req.query
    const body = req.body

    const BlogBody: any = {
        id: body.id,
        name: body.name,
        slug: body.slug,
        hostId: req.id,
        content: body.content,
        infor: body.infor,
        coverId: body.coverId,
        updateDate: new Date()
    }
    const blog = await prisma.blog.findFirst({ where: { id: Number(query.id) }, select: { hostId: true } })

    if (req.id === blog?.hostId) {
        await prisma.blog.update({ where: { id: Number(query.id) }, data: BlogBody })
            .catch((err) => {
                outPut.success = false
                outPut.message = "your updating blog is fail"
                res.json(outPut)
            }).then((data) => {
                outPut.success = true
                outPut.message = "your updating blog is success"
                res.json(outPut)
            })
    } else {
        outPut.success = false
        outPut.msg = "your can't update this blog"
        res.json(outPut)
    }
}
export const DeleteBlogController = async (req: CustomRequest, res: Response) => {
    const query = req.query
    const blog = await prisma.blog.findFirst({ where: { id: Number(query.id) }, select: { hostId: true } })

    if (req.id === blog?.hostId) {

        await prisma.blog.delete({ where: { id: Number(query.id) } })
            .catch((err) => {
                outPut.success = false
                outPut.message = "your blog is deleted fail"
                res.json(outPut)
                throw (err)
            }).then((data) => {
                outPut.success = true
                outPut.message = "your blog is deleted success"
                res.json(outPut)
            })
    } else {
        outPut.success = false
        outPut.msg = "your can't delete this blog"
        res.json(outPut)
    }
}
export const GetBookController = async (req: Request, res: Response) => {
    const query = req.query
    await prisma.book.findMany({
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
            chapter: true
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
export const PostBookController = async (req: CustomRequest, res: Response) => {
    const body = req.body
    const BookBody: any = {
        id: body.id,
        name: body.name,
        slug: body.slug,
        host: {
            connect: { id: Number(req.id) }
        },
        content: body.content,
        infor: body.infor,
        cover: {
            connect: {
                id: Number(body.coverId)
            }
        },
        file: body.fileId ? {
            connect: { id: Number(body.fileId) }
        } : {},
        category: body.categoryId ? {
            connect: { id: Number(body.categoryId) }
        } : {},
        chapter: {
            upsert: body.chapter.length ? body.chapter.map((ch: any) => {
                if (ch.id) {
                    return {
                        where: { id: ch.id },
                        update: {
                            name: ch.name,
                            slug: ch.slug,
                            content: ch.content,
                            index: ch.index,

                        },
                        create: {
                            name: ch.name,
                            slug: ch.slug,
                            content: ch.content,
                            index: ch.index,
                        },
                    }
                } else {
                    return {
                        where: { id: 0 },
                        update: {
                            name: ch.name,
                            slug: ch.slug,
                            content: ch.content,
                            index: ch.index,
                        },
                        create: {
                            name: ch.name,
                            slug: ch.slug,
                            content: ch.content,
                            index: ch.index,
                        },
                    }
                }
            }) : undefined,
        },
    }

    await prisma.book.create({ data: BookBody })
        .catch((err) => {
            outPut.success = false
            outPut.message = "your creating book is fail"
            res.json(outPut)
            throw (err)
        }).then((data) => {
            outPut.success = true
            outPut.message = "your creating book is success"
            res.json(outPut)
        })
}
export const UpdateBookController = async (req: CustomRequest, res: Response) => {

    const query = req.query
    const body = req.body
    const book = await prisma.book.findFirst({ where: { id: Number(query.id) }, select: { hostId: true, chapter: true } })
    const chapter = book?.chapter
    const chapterUpdate = body.chapter
    const chapterDelete = chapter ?
        chapter.filter((item1: any) =>
            !chapterUpdate.some((item2: any) => item2.id === item1.id)
        ) : [];

    const BookBody: any = {
        name: body.name,
        slug: body.slug,
        hostId: req.id,
        content: body.content,
        infor: body.infor,
        coverId: Number(body.coverId),
        fileId: body.fileId ? Number(body.fileId) : null,
        categoryId: Number(body.categoryId),
        chapter: {
            deleteMany: chapterDelete.map((ch: any) => { return { id: ch.id } }),
            upsert: body.chapter.map((ch: any) => {
                if (ch.id) {
                    return {
                        where: { id: ch.id },
                        update: {
                            name: ch.name,
                            slug: ch.slug,
                            content: ch.content,
                            index: ch.index,

                        },
                        create: {
                            name: ch.name,
                            slug: ch.slug,
                            content: ch.content,
                            index: ch.index,
                        },
                    }
                } else {
                    return {
                        where: { id: 0 },
                        update: {
                            name: ch.name,
                            slug: ch.slug,
                            content: ch.content,
                            index: ch.index,
                        },
                        create: {
                            name: ch.name,
                            slug: ch.slug,
                            content: ch.content,
                            index: ch.index,
                        },
                    }
                }
            }),
        },
        updateDate: new Date()
    }

    if (req.id === book?.hostId) {
        await prisma.book.update({ where: { id: Number(query.id) }, data: BookBody })
            .catch((err) => {
                console.log(err)
                outPut.success = false
                outPut.message = "your updating book is fail"
                return res.json(outPut)
            }).then((data) => {
                outPut.success = true
                outPut.message = "your updating book is success"
                res.json(outPut)
            })
    } else {
        outPut.success = false
        outPut.msg = "your can't update this book"
        res.json(outPut)
    }
}
export const DeleteBookController = async (req: CustomRequest, res: Response) => {
    const query = req.query
    const book = await prisma.book.findFirst({ where: { id: Number(query.id) }, select: { hostId: true } })

    if (req.id === book?.hostId) {

        await prisma.book.delete({ where: { id: Number(query.id) } })
            .catch((err) => {
                outPut.success = false
                outPut.message = "your book is deleted fail"
                res.json(outPut)
                throw (err)
            }).then((data) => {
                outPut.success = true
                outPut.message = "your book is deleted success"
                res.json(outPut)
            })
    } else {
        outPut.success = false
        outPut.msg = "your can't delete this book"
        res.json(outPut)
    }
}
export const GetPictureController = async (req: CustomRequest, res: Response) => {
    await prisma.pic.findMany({
        where: {
            id: req.query.id ? Number(req.query.id) : undefined,
            hostId: Number(req.id)
        },
        include: {
            host: {
                select: {
                    username: true
                }
            }
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
export const PostPictureController = async (req: CustomRequest, res: Response) => {
    const form = new IncomingForm();
    const today = new Date();
    form.parse(req, async (err: Error, fields: any, files: any) => {
        if (err) {
            throw err
        } else {
            const uploadFile = files && files.file;
            const client = new Client();
            await client.connect(sftpConfig).then(async () => {
                await client.put(uploadFile[0].filepath, process.env.FTP_PATH + "image/" + moment(today).format("YYYY.MM.DD_hh-mm-ss") + "_" + uploadFile[0].originalFilename)
                client.end()
                const file = await prisma.pic.create({ data: { hostId: Number(req.id), name: moment(today).format("YYYY.MM.DD_hh-mm-ss") + "_" + uploadFile[0].originalFilename } })
                res.json(file)
            });
        }
    })
}
export const DeletePictureController = async (req: CustomRequest, res: Response) => {
    const user = await prisma.user.findFirst({ where: { id: Number(req.id) }, select: { position: true } })
    const pic = await prisma.pic.findUnique({ where: { id: Number(req.query.id) } })
    if (req.id === pic?.hostId || user?.position === "admin") {
        const client = new Client();
        await client.connect(sftpConfig).then(async () => {
            const result = pic && await client.delete(process.env.FTP_PATH + "image/" + pic.name);
            if (result) {
                await prisma.pic.delete({ where: { id: Number(req.query.id) } })
                res.json({ success: true, msg: "this file is deleted success", })
            } else {
                res.json({ success: false, msg: "you cant delete this file", })
            }
            client.end()
        })
    } else {
        res.json({
            msg: "this file is not yours",
            success: false
        })

    }
}
export const GetPageController = async (req: CustomRequest, res: Response) => {
    const query = req.query
    await prisma.page.findMany({
        where: {
            archive: query.archive ? query.archive.toString() : undefined,
            id: query.id ? Number(query.id) : undefined,
            slug: query.slug ? query.slug.toString() : undefined,
        },
        include: {
            host: true,
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
export const PostPageController = async (req: CustomRequest, res: Response) => {
    const body = req.body

    const PageBody: any = {
        id: body.id,
        name: body.name,
        slug: body.slug,
        hostId: req.id,
        coverId: body.coverId,
        content: body.content,
    }
    await prisma.page.create({ data: PageBody })
        .catch((err) => {
            outPut.success = false
            outPut.message = "your creating page is fail"
            res.json(outPut)
            throw (err)
        }).then((data) => {
            outPut.success = true
            outPut.message = "your creating page is success"
            res.json(outPut)
        })
}
export const UpdatePageController = async (req: CustomRequest, res: Response) => {

    const query = req.query
    const body = req.body

    const PageBody: any = {
        id: body.id,
        name: body.name,
        slug: body.slug,
        hostId: req.id,
        coverId: body.coverId,
        content: body.content,
    }
    const page = await prisma.page.findFirst({ where: { id: Number(query.id) }, select: { hostId: true } })
    console.log(PageBody)
    await prisma.page.update({ where: { id: Number(query.id) }, data: PageBody })
        .catch((err) => {
            outPut.success = false
            outPut.message = "your updating page is fail"
            res.json(outPut)
        }).then((data) => {
            outPut.success = true
            outPut.message = "your updating page is success"
            res.json(outPut)
        })

}
export const DeletePageController = async (req: CustomRequest, res: Response) => {
    const query = req.query
    const page = await prisma.page.findFirst({ where: { id: Number(query.id) }, select: { hostId: true } })

    await prisma.page.delete({ where: { id: Number(query.id) } })
        .catch((err) => {
            outPut.success = false
            outPut.message = "your page is deleted fail"
            res.json(outPut)
            throw (err)
        }).then((data) => {
            outPut.success = true
            outPut.message = "your page is deleted success"
            res.json(outPut)
        })

}
export const GetFileController = async (req: CustomRequest, res: Response) => {
    await prisma.file.findMany({
        where: {
            id: req.query.id ? Number(req.query.id) : undefined,
            hostId: Number(req.id)
        },
        include: {
            host: {
                select: {
                    username: true
                }
            }
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
export const PostFileController = async (req: CustomRequest, res: Response) => {
    const form = new IncomingForm();
    const today = new Date();
    form.parse(req, async (err: Error, fields: any, files: any) => {
        if (err) {
            throw err
        } else {
            const uploadFile = files && files.file;
            const client = new Client();
            await client.connect(sftpConfig).then(async () => {
                await client.put(uploadFile[0].filepath, process.env.FTP_PATH + "file/" + moment(today).format("YYYY.MM.DD_hh-mm-ss") + "_" + uploadFile[0].originalFilename)
                client.end()
                const file = await prisma.file.create({ data: { hostId: Number(req.id), name: moment(today).format("YYYY.MM.DD_hh-mm-ss") + "_" + uploadFile[0].originalFilename } })
                res.json(file)
            });
        }
    })
}
export const DeletefileController = async (req: CustomRequest, res: Response) => {
    const user = await prisma.user.findFirst({ where: { id: Number(req.id) }, select: { position: true } })
    const file = await prisma.file.findUnique({ where: { id: Number(req.query.id) } })
    if (req.id === file?.hostId || user?.position === "admin") {
        const client = new Client();
        await client.connect(sftpConfig).then(async () => {
            const result = file && await client.delete(process.env.FTP_PATH + "file/" + file.name);
            if (result) {
                await prisma.file.delete({ where: { id: Number(req.query.id) } })
                res.json({ success: true, msg: "this picture is deleted success", })
            } else {
                res.json({ success: false, msg: "you cant delete this picture", })
            }
            client.end()
        })
    } else {
        res.json({
            msg: "this pic is not yours",
            success: false
        })

    }
}
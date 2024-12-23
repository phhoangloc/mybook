import { Router } from "express";
import {
    GetOneAdminController,
    GetAdminController,
    UpdateAdminController,
    PostCategoryController,
    UpdateCategoryController,
    DeleteCategoryController,
    GetBlogController,
    PostBlogController,
    UpdateBlogController,
    DeleteBlogController,
    GetPageController,
    PostPageController,
    UpdatePageController,
    DeletePageController,
    GetPictureController,
    PostPictureController,
    DeletePictureController,
    GetBookController,
    PostBookController,
    UpdateBookController,
    DeleteBookController,
    GetFileController,
    PostFileController,
    DeletefileController
} from "../controller/admin.Controller";
import {
    getCategoryController,
} from "../controller/controller";
export const AdminRouter = Router()

AdminRouter.get("/", GetOneAdminController)
AdminRouter.get("/user", GetAdminController)
AdminRouter.put("/user", UpdateAdminController)

AdminRouter.get("/category", getCategoryController)
AdminRouter.post("/category", PostCategoryController)
AdminRouter.put("/category", UpdateCategoryController)
AdminRouter.delete("/category", DeleteCategoryController)

AdminRouter.get("/blog", GetBlogController)
AdminRouter.post("/blog", PostBlogController)
AdminRouter.put("/blog", UpdateBlogController)
AdminRouter.delete("/blog", DeleteBlogController)

AdminRouter.get("/pic", GetPictureController)
AdminRouter.post("/pic", PostPictureController)
AdminRouter.delete("/pic", DeletePictureController)


AdminRouter.get("/page", GetPageController)
AdminRouter.post("/page", PostPageController)
AdminRouter.put("/page", UpdatePageController)
AdminRouter.delete("/page", DeletePageController)

AdminRouter.get("/book", GetBookController)
AdminRouter.post("/book", PostBookController)
AdminRouter.put("/book", UpdateBookController)
AdminRouter.delete("/book", DeleteBookController)

AdminRouter.get("/file", GetFileController)
AdminRouter.post("/file", PostFileController)
AdminRouter.delete("/file", DeletefileController)
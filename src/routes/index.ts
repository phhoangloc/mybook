import { Express } from "express"
import { UserRouter } from "./user.routes"
import { AdminRouter } from "./admin.routes"
import { 
    createAndSend,
    login,
    activeAccount,
    getBlogController,
    getCategoryController,
    checkuser,
    getPictureController,
    getPageController,
    getBookController
} from "../controller/controller"
import { AdminAuthen, UserAuthen } from "../authen/authen"

export const route = (app: Express) => {
    app.use("/api/user",UserAuthen, UserRouter)
    app.use("/api/admin",AdminAuthen, AdminRouter)

    app.post("/api/signup", createAndSend)
    app.post("/api/login", login)
    app.get("/api/active", activeAccount)
    app.get("/api/category", getCategoryController)
    app.get("/api/checkuser", checkuser)

    app.get("/api/blog", getBlogController)
    app.get("/api/book", getBookController)
    app.get("/api/pic", getPictureController)

    app.get("/api/page", getPageController)
}
import { Router } from "express";
import { GetUserController,UpdateUserController } from "../controller/user.Controller";
export const UserRouter = Router()

UserRouter.get("/", GetUserController)
UserRouter.put("/", UpdateUserController)
import { Router } from "express";
import * as userServices from './user.services.js';
const userRouter = Router()

userRouter.post("/signUp", userServices.signUp)
userRouter.post("/login", userServices.login)
userRouter.get("/profile/:id", userServices.getProfile)

export default userRouter
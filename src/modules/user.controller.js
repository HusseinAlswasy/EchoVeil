import { Router } from "express";
import * as userServices from './user.services.js';
import { auth } from "../common/middleware/authentication.js";
const userRouter = Router()

userRouter.post("/signUp", userServices.signUp)
userRouter.post("/signup/gmail", userServices.signUpWithGmail)
userRouter.post("/login", userServices.login)
userRouter.get("/profile",auth, userServices.getProfile)

export default userRouter   
import { Router } from "express";
import * as userServices from './user.services.js';
import { authentication } from "../common/middleware/authentication.js";
import { authorization } from "../common/middleware/authorization.js";
import { userRoles } from "../enums/enums.js";
const userRouter = Router()

userRouter.post("/signUp", userServices.signUp)
userRouter.post("/signup/gmail", userServices.signUpWithGmail)
userRouter.post("/login", userServices.login)
userRouter.get("/profile", authentication, authorization(["user"]), userServices.getProfile)

export default userRouter   
import { Router } from "express";
import * as userServices from './user.services.js';
import { authentication } from "../../common/middleware/authentication.js";
import { authorization } from "../../common/middleware/authorization.js";
import { userRoles } from "../../enums/enums.js";
import { validation } from "../../common/middleware/validation.js";
import * as uS from "../users/user.validation.js"

const userRouter = Router()

userRouter.post("/signUp", validation(uS.signUpSchema), userServices.signUp)
userRouter.post("/signup/gmail", userServices.signUpWithGmail)
userRouter.post("/login",validation(uS.loginSchema), userServices.login)
userRouter.get("/profile", authentication, authorization(Object.values(userRoles)), userServices.getProfile)

export default userRouter   
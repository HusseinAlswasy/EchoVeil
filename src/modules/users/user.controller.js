import { Router } from "express";
import * as userServices from './user.services.js';
import { authentication } from "../../common/middleware/authentication.js";
import { authorization } from "../../common/middleware/authorization.js";
import { userRoles } from "../../enums/enums.js";
import { validation } from "../../common/middleware/validation.js";
import * as uS from "../users/user.validation.js"
import { multerLocal } from "../../common/middleware/multer.js";
import { fileTypes } from "../../enums/multer.enums.js";

const userRouter = Router()
userRouter.post("/signUp",
    multerLocal({ customPath: "users", customTypes: fileTypes.image })
        .fields([{ name: "image", maxCount: 1 }, { name: "images", maxCount: 2 }]),
    validation(uS.signUpSchema),
    userServices.signUp)
userRouter.post("/signup/gmail", userServices.signUpWithGmail)
userRouter.post("/login", validation(uS.loginSchema), userServices.login)
userRouter.get("/profile", authentication, authorization(Object.values(userRoles)), userServices.getProfile)
userRouter.post("/refresh-Token", userServices.refreshToken) 
export default userRouter   
import { Router } from "express";
import * as uS from './user.services.js';
import { authentication } from "../../common/middleware/authentication.js";
import { authorization } from "../../common/middleware/authorization.js";
import { userRoles } from "../../enums/enums.js";
import { validation } from "../../common/middleware/validation.js";
import * as uV from "../users/user.validation.js"
import { multerLocal } from "../../common/middleware/multer.js";
import { fileTypes } from "../../enums/multer.enums.js";

const userRouter = Router()
userRouter.post("/signUp",
    multerLocal({ customPath: "users", customTypes: fileTypes.image })
        .fields([{ name: "image", maxCount: 1 }, { name: "images", maxCount: 2 }]),
    validation(uV.signUpSchema),
    uS.signUp)

userRouter.post("/signup/gmail", uS.signUpWithGmail)

userRouter.patch("/confirmEmail",validation(uV.confirmEmailSchema), uS.confirm)

userRouter.post("/resend-otp", uS.resendOtp)

userRouter.post("/login", validation(uV.loginSchema), uS.login)

userRouter.get("/profile", authentication, authorization(Object.values(userRoles)), uS.getProfile)

userRouter.post("/refresh-Token", uS.refreshToken)

userRouter.get("/profile/:id",validation(uV.idSchema),uS.shareProfile)

userRouter.patch("/update/profile",validation(uV.updateSchema),authentication,uS.updateProfile)

userRouter.patch("/update/password",validation(uV.updatePasswordSchema),authentication,uS.updatePassword)

userRouter.patch("/forget_password",uS.forgetPassword)

userRouter.patch("/reset_password",uS.resetPassword)

userRouter.patch("/logout",validation(uV.logoutSchema),authentication,uS.logout)



export default userRouter   
import userModel from "../../models/user.model.js";
import * as dbServices from '../../DB/services/db.services.js';
import { encrypt, decrypt } from "../../common/security/encrypt.js";
import { hash, compareHash } from "../../common/security/hash.js";
import { generateToken, verifyToken } from "../../common/utils/token/token.services.js";
import { OAuth2Client } from 'google-auth-library';
import { userProvider } from "../../enums/enums.js";
import { successResponse } from "../../common/utils/sucsess.response.js";
import { deleteUploadedFiles } from "../../common/utils/generalRules.js";
import { Hash, randomUUID } from "node:crypto";
import revokedTokenModel from "../../models/revokedToken.model.js";
import { compare } from "bcrypt";
import * as redisServices from "../../DB/services/redis_db.services.js";
import sendEmail, { otp } from "../../common/service/send_email.js";
import { event_name, eventEmitter } from "../../common/utils/events/sendEmailEvent.js";
import { emailTemplate } from "../../common/utils/email.template.js";

const sendEmailOtp = async ({ email, confirmed } = {}) => {
    const isBlocked = await redisServices.ttl(await redisServices.block_otp_key(email))
    if (isBlocked > 0) {
        throw new Error(`You Blocked. and you can resend otp after  ${isBlocked} seconds.`, { cause: 400 });

    }
    const otpTtl = await redisServices.ttl(`otp:${email}`);
    if (otpTtl > 0) {
        throw new Error(`OTP already sent. Please wait ${otpTtl} seconds before requesting a new one.`, { cause: 400 });
    }

    const maxOtpKey = await redisServices.getValue(await redisServices.max_otp_key(email));

    if (maxOtpKey >= 3) {
        await redisServices.setValue({
            key: await redisServices.block_otp_key(email),
            value: "1",
            ttl: 60 * 2
        })

        throw new Error(`You have exceeded the maximum number of OTP requests. Please try again later.`, { cause: 400 });

    }
    const user = await dbServices.findOne(
        {
            model: userModel,
            filter: { email, isConfirmed: { $exists: confirmed } },
        }
    )
    if (!user) {
        throw new Error("Email Already Exist or Already Confirmed", { cause: 404 });
    }
    const otpCode = await otp()

    const emailSent = await sendEmail({
        to: email,
        subject: "Email Verification",
        html: emailTemplate(
            {
                firstName: user.firstName,
                email,
                otp: otpCode,
            }
        ),
    })
    if (!emailSent) {
        throw new Error("Failed to send verification email", { cause: 500 });
    }

    await redisServices.setValue({
        key: `otp:${email}`,
        value: await hash(`${otpCode}`),
        ttl: 60  // 1 minutes 
    });

    await redisServices.incr(await redisServices.max_otp_key(email));
}
//===========================sign Up===================================
export const signUp = async (req, res) => {
    const { firstName, lastName, email, password, phone, age, gender } = req.body;

    const userExist = await userModel.findOne({ email });
    if (userExist) {
        await deleteUploadedFiles(req.files)
        throw new Error("Email Already Exist", { cause: 409 });
    }

    // let arr_pathes = []
    // if (req?.files?.images?.length) {
    //     for (const files of req.files.images) {
    //         arr_pathes.push(files.path)
    //     }
    // }
    const otpCode = await otp()
    const otpHashed = await hash(otpCode.toString())
    eventEmitter.emit(event_name.confirmEmail, async () => {

        const emailSent = await sendEmail({
            to: email,
            subject: "Email Verification",
            html: emailTemplate({
                firstName,
                email,
                otp: otpCode,
            }),
        })

        if (!emailSent) {
            throw new Error("Failed to send verification email", { cause: 500 });
        }
    })


    await redisServices.setValue({
        key: `otp:${email}`,
        value: otpHashed,
        ttl: 60 // 1 minutes 
    });

    await redisServices.setValue({
        key: await redisServices.max_otp_key(email),
        value: 1,
        ttl: 60 * 6// 1 minutes 
    });


    const user = await dbServices.create({
        model: userModel,
        data: {
            firstName,
            lastName,
            email,
            password: await hash(password),
            phone: encrypt(phone),
            age,
            gender,
            profileImage: req?.files?.image?.length > 0 ? req.files.image[0].path : null,
            // coverImage: arr_pathes
        },
    });

    successResponse({ res, status: 200, data: user })
}
//===========================Confirm Email===================================
export const confirm = async (req, res) => {
    const { email, otp } = req.body;

    const otpExist = await redisServices.getValue(`otp:${email}`);
    if (!otpExist) {
        throw new Error("OTP Expired Or Not Exist", { cause: 400 });
    }
    const isValid = await compareHash(otp, otpExist);

    if (!isValid) {
        throw new Error("Invalid OTP", { cause: 400 });
    }

    const user = await dbServices.findOneAndUpdate(
        {
            model: userModel,
            filter: { email, isConfirmed: { $exists: false } },
            update: { isConfirmed: true }
        }
    )
    if (!user) {
        throw new Error("User Not Exist or Already Confirmed", { cause: 404 });
    }
    await redisServices.deleteKey(`otp:${email}`)

    successResponse({ res, status: 200, data: { message: "Email Confirmed Successfuly" } })
}
//===========================Resend OTp===================================
export const resendOtp = async (req, res) => {
    const { email } = req.body;

    await sendEmailOtp({ email, confirmed: false })

    successResponse({ res, status: 200, data: { message: "Email Confirmed Successfuly" } })
}
//===========================sign Up With Gmail===================================
export const signUpWithGmail = async (req, res) => {
    const { idToken } = req.body;
    const client = new OAuth2Client();
    const ticket = await client.verifyIdToken({
        idToken,
        audience: "276272966505-lrn0b156nbvospqaed3r9eft3q42ni68.apps.googleusercontent.com",
    });
    const payload = ticket.getPayload();
    console.log({ payload });
    const { email, picture, family_name, given_name, email_verified } = payload;
    const emailExist = await dbServices.findOne({ model: userModel, data: { email } });
    let user;
    if (!emailExist) {
        user = await dbServices.create({
            model: userModel,
            data: { firstName: given_name, lastName: family_name, email, profileImage: picture, isConfirmed: email_verified, provider: userProvider.google },
        });
    } else {
        user = emailExist;
    }
    if (emailExist && emailExist.provider !== userProvider.google) {
        throw new Error("email already exist with diffrent provider", { cause: 409 })
    }
    const accessToken = generateToken({
        payload: { id: user._id },
        secretKey: process.env.JWT_SECRET,
        options: { expiresIn: "1h" },
    },);

    const refreshToken = generateToken({
        payload: { id: user._id },
        secretKey: process.env.JWT_REFRESH_SECRET,
        options: { expiresIn: "1y" },
    },);

    successResponse({
        res,
        status: 201,
        data: {
            accessToken,
            refreshToken
        }
    });

}
//===========================login===================================
export const login = async (req, res) => {

    const { email, password } = req.body;

    const user = await dbServices.findOne({
        model: userModel,
        filter: { email, provider: userProvider.system, isConfirmed: { $exists: true } },
    })
    if (!user) {
        throw new Error("User Not Exist or Not Confirmed", { cause: 404 });
    }
    const isMatched = await compareHash(
        password,
        user.password
    );
    if (!isMatched) {
        return res.status(401).json({ message: "Password Not Correct" });
    }
    let idToken = randomUUID()
    const accessToken = generateToken({
        payload: { id: user._id },
        secretKey: process.env.JWT_SECRET,
        options: {
            expiresIn: "1h", jwtid: idToken
        },
    },);

    const refreshToken = generateToken({
        payload: { id: user._id },
        secretKey: process.env.JWT_REFRESH_SECRET,
        options: {
            expiresIn: "1y", jwtid: idToken,
        },
    },);

    successResponse({
        res,
        status: 201,
        data: { accessToken, refreshToken },
    })
}
//===========================get Profile===================================
export const getProfile = async (req, res) => {
    let phone = decrypt(req.user.phone)
    successResponse({ res, status: 201, data: { ...req.user._doc, phone } });
}
//===========================share Profile===================================
export const shareProfile = async (req, res) => {
    const { id } = req.params;
    const user = await dbServices.findById({ model: userModel, id, options: { select: "-password" } });
    if (!user) {
        throw new Error(
            "User Not Exist",
            { cause: 404 }
        )
    }
    successResponse({ res, status: 201, data: user });
}
//===========================update Profile===================================
export const updateProfile = async (req, res) => {
    const { firstName, lastName, phone, age, gender } = req.body;
    let updateQuery = {};
    if (firstName !== undefined) updateQuery.firstName = firstName;
    if (lastName !== undefined) updateQuery.lastName = lastName;
    if (phone !== undefined) updateQuery.phone = encrypt(phone);
    if (age !== undefined) updateQuery.age = age;
    if (gender !== undefined) updateQuery.gender = gender;

    const user = await dbServices.findOneAndUpdate({
        model: userModel,
        filter: { _id: req.user._id },
        update: updateQuery,
    })
    successResponse({ res, status: 201, data: user });
}
//===========================update Password===================================
export const updatePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const user = await userModel.findById(req.user._id).select("+password");
    if (!user || !(await compareHash(oldPassword, user.password))) {
        throw new Error("Old Password Not Correct", { cause: 400 });
    }
    user.password = await hash(newPassword);
    await user.save();
    successResponse({ res, status: 201, data: user });
}
//===========================forget Password===================================
export const forgetPassword = async (req, res) => {
    const { email } = req.body;

    await sendEmailOtp({ email, confirmed: true })

    successResponse({ res, status: 201, data: "otp send successfuly to forget password" });
}
//===========================forget Password===================================
export const resetPassword = async (req, res) => {
    const { email, code, password } = req.body;

    const otpExist = await redisServices.getValue(`otp:${email}`);
    if (!otpExist) {
        throw new Error("OTP Expired Or Not Exist", { cause: 400 });
    }
    const isValid = await compareHash(code, otpExist);

    if (!isValid) {
        throw new Error("Invalid OTP", { cause: 400 });
    }
    const user = await dbServices.findOneAndUpdate(
        {
            model: userModel,
            filter: { email, isConfirmed: { $exists: true } },
            update: {
                password: await hash(password),
                changeCredential: new Date()
            }
        }
    )
    if (!user) {
        throw new Error("Email Not Exist or Already Not Confirmed", { cause: 404 });
    }
    await redisServices.deleteKey(`otp:${email}`)


    successResponse({ res, status: 201, data: "password reset successfuly" });
}
//===========================refresh Token===================================
export const refreshToken = async (req, res) => {
    const authorization = req.headers.authorization || req.body?.authorization;

    if (!authorization?.startsWith("Bearer ")) {
        throw new Error("Please provide a valid token", {
            cause: 401
        });
    }
    const token = authorization.split(" ")[1];

    const decode = verifyToken({ token, secretKey: process.env.JWT_REFRESH_SECRET });

    if (!decode || !decode.id) {
        throw new Error("invalid payload token", { cause: 400 });
    }

    const user = await userModel.findById(decode.id).select("-password");

    if (!user) {
        throw new Error("User Not Exist");
    }
    const accessToken = generateToken({
        payload: { id: user._id },
        secretKey: process.env.JWT_SECRET,
        options: { expiresIn: "1h" },
    },);


    successResponse({ res, status: 201, data: accessToken });

}
//===========================Log Out===================================
export const logout = async (req, res, next) => {
    const { flag } = req.query
    if (flag == "all") {
        req.user.changeCredential = new Date()
        await req.user.save()
        await redisServices.deleteKey(await redisServices.keys(`revoke_token:${req.user._id}`))
    } else {
        await redisServices.setValue({
            key: `revoke_token:${req.user._id}:${req.decode.jti}`,
            value: `${req.decode.jti}`,
            ttl: req.decode.exp - Math.floor(Date.now() / 1000)
        })
        // await dbServices.create({
        //     model: revokedTokenModel,
        //     data: {
        //         userId: req.user._id,
        //         tokenId: req.decode.jti, // id token new 
        //         expireAt: new Date(req.decode.exp * 1000)
        //     }
        // })
    }

    successResponse({ res, status: 201, message: "Logout Success" })
}
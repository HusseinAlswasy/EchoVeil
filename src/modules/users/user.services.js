import userModel from "../../models/user.model.js";
import * as dbServices from '../../DB/db.services.js';
import { encrypt, decrypt } from "../../common/security/encrypt.js";
import { hash, compareHash } from "../../common/security/hash.js";
import { generateToken, verifyToken } from "../../common/utils/token/token.services.js";
import { OAuth2Client } from 'google-auth-library';
import { userProvider } from "../../enums/enums.js";
import { successResponse } from "../../common/utils/sucsess.response.js";
import { deleteUploadedFiles } from "../../common/utils/generalRules.js";


export const signUp = async (req, res) => {
    const { firstName, lastName, email, password, phone, age, gender } = req.body;

    const userExist = await userModel.findOne({ email });
    if (userExist) {
        await deleteUploadedFiles(req.files)
        throw new Error("Email Already Exist", { cause: 409 });
    }

    let arr_pathes = []
    if (req?.files?.images?.length) {
        for (const files of req.files.images) {
            arr_pathes.push(files.path)
        }
    }

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
            coverImage: arr_pathes
        },
    });

    successResponse({ res, status: 200, data: user })
}

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

export const login = async (req, res) => {

    const { email, password } = req.body;

    const user = await dbServices.findOne({
        model: userModel,
        filter: { email, provider: userProvider.system },
    })
    if (!user) {
        throw new Error("User Not Exist");
    }
    const isMatched = await compareHash(
        password,
        user.password
    );
    if (!isMatched) {
        return res.status(401).json({ message: "Password Not Correct" });
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
        data: { accessToken, refreshToken },
    })
}

export const getProfile = async (req, res) => {
    successResponse({ res, status: 201, data: req.user });

}

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
import userModel from "../models/user.model.js";
import * as dbServices from '../DB/db.services.js';
import { encrypt, decrypt } from "../common/security/encrypt.js";
import { hash, compareHash } from "../common/security/hash.js";
import { generateToken } from "../common/utils/token/token.services.js";
import { OAuth2Client } from 'google-auth-library';
import { userProvider } from "../enums/enums.js";


export const signUp = async (req, res) => {
    const { fullName, email, password, phone, age, gender } = req.body;
    const userExist = await userModel.findOne({ email });
    if (userExist) {
        throw new Error("Email Already Exist", { cause: 409 });
    }

    const user = await dbServices.create({
        model: userModel,
        data: { fullName, email, password: await hash(password), phone: encrypt(phone), age, gender },
    });

    res.status(201).json({ message: "User Created Successfuly", user });
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

    res.status(200).json({ message: "User Login Successfuly", accessToken });

}

export const login = async (req, res) => {

    const { email, password } = req.body;

    const user = await dbServices.findOne({
        model: userModel,
        data: { email, provider: userProvider.system },
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

    res.status(200).json({ message: "User Login Successfuly", accessToken });
}

export const getProfile = async (req, res) => {
    res.status(200).json({ message: "User Geted Successfuly", user: req.user });
}
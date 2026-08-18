import userModel from "../models/user.model.js";
import * as dbServices from '../DB/db.services.js';
import { encrypt, decrypt } from "../common/security/encrypt.js";
import { hash, compareHash } from "../common/security/hash.js";
import { generateToken } from "../common/utils/token/token.services.js";

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

export const login = async (req, res) => {

    const { email, password } = req.body;

    const user = await dbServices.findOne({
        model: userModel,
        data: { email },
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

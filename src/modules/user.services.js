import userModel from "../models/user.model.js";
import * as dbServices from '../DB/db.services.js';
import { encrypt, decrypt } from "../common/security/encrypt.js";
import { hash, bcrypt } from "../common/security/hash.js";

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
    res.status(200).json({ message: "User Login Successfuly", user });
}

export const getProfile = async (req, res) => {

    const { id } = req.params;
    const user = await dbServices.findOne({
        model: userModel,
        data: { _id: id }
    })
    if (!user) {
        throw new Error("User Not Exist");
    }

    res.status(200).json({ message: "User Geted Successfuly", user: { ...user._doc, phone: user.phone ? decrypt(user.phone) : null } });
}


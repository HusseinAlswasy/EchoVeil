
import userModel from '../../models/user.model.js';
import { verifyToken } from '../utils/token/token.services.js';

export const auth = async (req, res, next) => {
    const authorization = req.headers.authorization;

    if (!authorization?.startsWith("Bearer ")) {
        throw new Error("Please provide a valid token", {
            cause: 401
        });
    }
    const token = authorization.split(" ")[1];


    const decode = verifyToken({ token, secretKey: process.env.JWT_SECRET });

    if (!decode || !decode.id) {
        throw new Error("invalid payload token", { cause: 400 });
    }

    const user = await userModel.findById(decode.id).select("-password");

    if (!user) {
        throw new Error("User Not Exist");
    }

    req.user = user

    next()

}
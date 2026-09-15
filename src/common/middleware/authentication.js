
import userModel from '../../models/user.model.js';
import * as dbServices from '../../DB/services/db.services.js';
import { verifyToken } from '../utils/token/token.services.js';
import revokedTokenModel from '../../models/revokedToken.model.js';
import * as redisServices from "../../DB/services/redis_db.services.js";

export const authentication = async (req, res, next) => {
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

    const user = await userModel.findOne({
        _id: decode.id,
        isConfirmed: { $exists: true },
    }).select("-password");

    if (!user) {
        throw new Error("User Not Exist Or Not Confirmed");
    }
    const revokedToken = await redisServices.getValue(
        `revoke_token:${user._id}:${decode.jti}`
    );

    if (revokedToken) {
        throw new Error("you are logout please login again...", {
            cause: 401
        });
    }

    req.user = user
    req.decode = decode;


    next()
}


// import userModel from '../../models/user.model.js';
// import { verifyToken } from '../utils/token/token.services.js';

// export const authentication = async (req, res, next) => {
//     const authorization = req.headers.authorization;

//     if (!authorization?.startsWith("Bearer ")) {
//         throw new Error("Please provide a valid token", {
//             cause: 401
//         });
//     }
//     const token = authorization.split(" ")[1];

//     const decode = verifyToken({ token: authorization, secretKey: process.env.JWT_SECRET });

//     if (!decode || !decode.id) {
//         throw new Error("invalid payload token", { cause: 400 });
//     }

//     const user = await userModel.findOne({_id:decode.id})
//     if (!user) {
//         throw new Error("User Not Exist");
//     }

//     req.user = user

//     next()
// }
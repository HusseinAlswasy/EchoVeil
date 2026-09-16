import { successResponse } from "../../common/utils/sucsess.response.js";
import * as dbServices from '../../DB/services/db.services.js';
import messageModel from "../../models/message.model.js";
import userModel from "../../models/user.model.js";

//===========================Create Message===================================
export const createMessage = async (req, res) => {
    const { content, userId } = req.body;

    const userExist = await dbServices.findOne({
        model: userModel,
        filter: {
            _id: userId
        }
    })

    if (!userExist) {
        throw new Error("User Not Exist")
    }

    const message = await dbServices.create({
        model: messageModel,
        data: {
            content,
            userId
        }
    })

    successResponse({ res, status: 200, data: message })
}

//===========================Get Message===================================
export const getMessage = async (req, res) => {
    const { id } = req.params;

    const message = await dbServices.findOne({
        model: messageModel,
        filter: {
            _id: id,
            userId: req.user._id
        }
    })

    if(!message){
        throw new Error("Message Not Found Or You Are Not Authorized")
    }

    successResponse({ res, status: 200, data: message })
}


//===========================Get All Message===================================
export const getAllMessage = async (req, res) => {

    const message = await dbServices.find({
        model: messageModel,
        filter: {
            userId: req.user._id
        }
    })
    successResponse({ res, status: 200, data: message })
}

import { Router } from "express";
import * as mS from './message.services.js';
import * as mV from "./message.validation.js";
import { validation } from "../../common/middleware/validation.js";
import { authentication } from "../../common/middleware/authentication.js";

const messageRouter = Router()

messageRouter.post("/create", validation(mV.messageSchema), mS.createMessage)

messageRouter.get("/get_message/:id", authentication, mS.getMessage)

messageRouter.get("/get_all_message", authentication, mS.getAllMessage)


export default messageRouter     
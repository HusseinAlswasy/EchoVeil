import joi from "joi"
import { general_rules } from "../../common/utils/generalRules.js"

export const messageSchema = {
    body: joi.object({
        content: joi.string().min(2).max(10000).required(),
        userId:general_rules.id.required()
    }).required()
}
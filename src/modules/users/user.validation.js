import joi from "joi"
import { userGender } from "../../enums/enums.js"

export const signUpSchema = {
    body: joi.object({
        firstName: joi.string().min(2).max(12).alphanum().required(),
        lastName: joi.string().min(2).max(12).alphanum().required(),
        email: joi.string().email().required(),
        password: joi.string().required(),
        cPassword: joi.string().valid(joi.ref("password")).required(),
        gender: joi.string().valid(userGender.male, userGender.female).required(),
        age: joi.number().integer().positive().required(),
        phone: joi.string().required(),
    }).required(),
    // query: joi.object({
    //     flag: joi.boolean().required()
    // }).required()
}

export const loginSchema = {
    body: joi.object({
        email: joi.string().email().required(),
        password: joi.string().required(),
    }).required()

}
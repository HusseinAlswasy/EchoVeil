import joi from "joi"
import { userGender } from "../../enums/enums.js"
import { general_rules } from "../../common/utils/generalRules.js"
import { Types } from "mongoose"

export const signUpSchema = {
    body: joi.object({
        firstName: joi.string().min(2).max(12).required().messages({
            "any.required": "First Name is Required",
            "string.empty": "First Name Cannot Be Empty"
        }),
        lastName: joi.string().min(2).max(12).required(),
        email: general_rules.email.required(),
        password: general_rules.password.required(),
        cPassword: joi.string().valid(joi.ref("password")).required(),
        gender: joi.string().valid(userGender.male, userGender.female).required(),
        age: joi.number().integer().positive().required(),
        phone: joi.string().required(),
    }).required().messages({
        "any.required": "Body Data is Required"
    }),

    // files: joi.object({
    //     image: joi.array().items(general_rules.file.required()).length(1).required(),

    //     images: joi.array().items(general_rules.file.required()).max(2).required(),

    // })
}

export const updateSchema = {
    body: joi.object({
        firstName: joi.string(),
        lastName: joi.string(),
        gender: joi.string().valid(userGender.male, userGender.female),
        age: joi.number().integer().positive(),
        phone: joi.string(),
    }).required()
}

export const updatePasswordSchema = {
    body: joi.object({
        oldPassword: general_rules.password.required(),
        newPassword: general_rules.password.required(),
        cPassword: joi.string().valid(joi.ref("newPassword")).required(),
    }).required()
}

export const loginSchema = {
    body: joi.object({
        email: joi.string().email().required(),
        password: joi.string().required(),
    }).required()
}

export const confirmEmailSchema = {
    body: joi.object({
        email: joi.string().email().required(),
        otp: joi.string().length(6).pattern(/^[0-9]{6}$/).required(),
    }).required()
}


export const idSchema = {
    params: joi.object({
        id: general_rules.id.required(),
    }).required()

}

export const logoutSchema = {
    query: joi.object({
        flag: joi.string().valid("all", "current").required()
    }).required()

}
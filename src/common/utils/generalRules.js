import joi from "joi"
import fs from 'fs/promises'


export const general_rules = {

    email: joi.string().email(),
    password: joi.string()
        .regex(/^[A-Z]?[a-zA-Z0-9]{8}$/),

    file: joi.object({
        fieldname: joi.string().required(),
        originalname: joi.string().required(),
        encoding: joi.string().required(),
        mimetype: joi.string().required(),
        size: joi.number().required(),
        destination: joi.string().required(),
        filename: joi.string().required(),
        path: joi.string().required(),
    }).messages({
        "any.required": "file is required"
    })
}

export const deleteUploadedFiles = async (files) => {
    if (!files) return

    for (const filed of Object.values(files)) {
        for (const file of filed) {
            try {
                await fs.unlink(file.path)
            } catch (error) {
                console.log("Error deleting", error.messages);
            }
        }
    }
}
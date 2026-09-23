import dotenv from "dotenv";
import { resolve } from "node:path";

const node_env = process.env.NODE_ENV;

let env_pathes = {
    development: ".env.development",
    production: ".env.production"
}

dotenv.config({ path: resolve(`config/${env_pathes[node_env]}`) })


export const PORT = process.env.PORT
export const MONGO_URI = process.env.MONGO_URI
export const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY
export const JWT_SECRET = process.env.JWT_SECRET
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET
export const CLOUDINARY_NAME = process.env.CLOUDINARY_NAME
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET
export const EMAIL_ADDRESS = process.env.EMAIL_ADDRESS
export const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD
export const REDIS_URL = process.env.REDIS_URL
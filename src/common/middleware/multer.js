
import multer from "multer";
import fs from "node:fs";
import { resolve } from "node:path";
export const multerLocal = ({ customPath = "general", customTypes = [] }) => {
    const dir_path = `uploads/${customPath}`;
    if (!fs.existsSync(dir_path)) {
        fs.mkdirSync(dir_path, { recursive: true })
    }
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, dir_path)
        },
        filename: function (req, file, cb) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
            cb(null, uniqueSuffix + '_' + file.originalname)
        }
    })

    function fileFilter(req, file, cb) {
        // console.log({ file });  // type file in console
        if (!customTypes.includes(file.mimetype)) {
            cb(new Error('Invalid File Type'))
        } else {
            cb(null, true)
        }
    }

    const upload = multer({ storage, fileFilter })
    return upload
}


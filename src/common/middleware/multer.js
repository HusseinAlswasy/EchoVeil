
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
        const ext = file.originalname.split(".").pop().toLowerCase();
        const allowedExt = ["jpg", "jpeg", "png", "gif", "webp"];

        if (!customTypes.includes(file.mimetype) && !allowedExt.includes(ext)) {
            cb(new Error("Invalid File Type"));
        } else {
            cb(null, true);
        }
    }


    const upload = multer({ storage, fileFilter })
    return upload
}

// ================= Cloud =================

export const multerCloud = ({
    customTypes = []
} = {}) => {

    const storage = multer.memoryStorage();

    function fileFilter(req, file, cb) {        

        const ext = file.originalname
            .split(".")
            .pop()
            .toLowerCase();

        const allowedExt = [
            "jpg",
            "jpeg",
            "png",
            "gif",
            "webp"
        ];

        if (
            !customTypes.includes(file.mimetype) &&
            !allowedExt.includes(ext)
        ) {
            cb(new Error("Invalid File Type"));
        } else {
            cb(null, true);
        }
    }

    const upload = multer({
        storage,
        fileFilter
    });

    return upload;
};


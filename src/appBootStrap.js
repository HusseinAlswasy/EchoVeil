import express from "express";
import connectionDB from "./DB/connectionDB.js";
import connectionDB_redis from "./DB/connectionRedis.js";
import userRouter from "./modules/users/user.controller.js";
import cors from 'cors';
import messageRouter from "./modules/messages/message.controller.js";
import { PORT } from "../config/config.service.js";
const app = express();
const port = PORT

const appBootStrap = async () => {
    app.use(cors(), express.json()); 

    await connectionDB()
    await connectionDB_redis()

    app.use("/users", userRouter)
    app.use("/messages", messageRouter)

    app.get("/", (req, res, next) => {
        res.status(201).json({ message: "Saraha API is running successfully" });
    })

    app.get("{/*demo}", (req, res) => {
        throw new Error(`url:${req.originalUrl} and method:${req.method} not correct`, { cause: 404 });

    })

    app.use((error, req, res, next) => {
        res.status(error.cause || 500).json({
            message: error.message,
            statusCode: error.cause || 500,
            stack: error.stack,

        });
    });

    app.listen(port, () => {
        console.log(`App Work Successfuly on port : ${port}`);
    })
}

export default appBootStrap
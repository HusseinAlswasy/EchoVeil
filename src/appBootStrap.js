import express from "express";
import connect from "./DB/connectionDB.js";
import userRouter from "./modules/user.controller.js";
const app = express();
const port = 3000;

const appBootStrap = async () => {

    app.use(express.json());
    await connect()

    app.use("/users", userRouter)

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
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import connectionDB from "./DB/connectionDB.js";
import connectionDB_redis from "./DB/connectionRedis.js";
import userRouter from "./modules/users/user.controller.js";
import messageRouter from "./modules/messages/message.controller.js";

const app = express();

const limiter = rateLimit({
    windowMs: 60 * 5 * 1000,
    limit: 3,
    message: "Game Over",
    statusCode: 400
});

app.use(
    cors(),
    helmet(),
    limiter,
    express.json()
);

await connectionDB();
await connectionDB_redis();

app.use("/users", userRouter);
app.use("/messages", messageRouter);

app.get("/", (req, res) => {
    res.status(200).json({
        message: "EchoVeil API is running successfully"
    });
});

app.get("{/*demo}", (req, res) => {
    throw new Error(
        `url:${req.originalUrl} and method:${req.method} not correct`,
        { cause: 404 }
    );
});

app.use((error, req, res, next) => {
    res.status(error.cause || 500).json({
        message: error.message,
        statusCode: error.cause || 500,
        stack: error.stack
    });
});

export default app;
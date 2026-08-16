import mongoose from "mongoose";
import dns from "node:dns";
import "dotenv/config";

dns.setServers([
    "8.8.8.8",
    "1.1.1.1",
])
const connectionDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Database connected successfully❤️");

    } catch (error) {
        console.log("Database connection failed:🤷‍♂️", error.message);

    }
}

export default connectionDB

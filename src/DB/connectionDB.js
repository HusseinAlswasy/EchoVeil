import mongoose from "mongoose";
import dns from "node:dns";
import { MONGO_URI } from "../../config/config.service.js";
 
dns.setServers([
    "8.8.8.8",
    "1.1.1.1",
])
const connectionDB = async () => { 
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Database connected successfully❤️");

    } catch (error) {
        console.log("Database connection failed:🤷‍♂️", error.message);

    }
}

export default connectionDB

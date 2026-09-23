
import { createClient } from "redis"


export const redis_client = createClient({
    url: process.env.REDIS_URL
});

const connectionDB_redis = async () => {
    try {
        await redis_client.connect();
        console.log("Redis connected successfully❤️");

    } catch (error) {
        console.log("Redis connection failed:🤷‍♂️", error.message);

    }
}

export default connectionDB_redis
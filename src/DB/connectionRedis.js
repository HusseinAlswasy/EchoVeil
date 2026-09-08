
import { createClient } from "redis"

export const redis_client = createClient({
    url: "rediss://default:gQAAAAAAAXq8AAIgcDFhMWUxZDA3NjBkN2U0Yjk2YmJmZDc5NTIxMjcyY2MzZg@teaching-wasp-96956.upstash.io:6379"
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
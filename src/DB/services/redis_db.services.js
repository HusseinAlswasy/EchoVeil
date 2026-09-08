import { redis_client } from '../../DB/connectionRedis.js';

export const setValue = async ({ key, value, ttl } = {}) => {
    try {
        value = typeof value == 'string' ? value : JSON.stringify(value);
        return ttl ? await redis_client.set(key, value, { EX: ttl }) : await redis_client.set(key, value);
    } catch (error) {
        console.log(error, `\nRedis setValue Failed`);
    }
}

export const updateValue = async ({ key, value, ttl } = {}) => {
    try {
        if (!await redis_client.exists(key)) throw new Error(`Key:${key} not found in Redis`);
        return await setValue({ key, value, ttl });
    } catch (error) {
        console.log(error, `\nRedis updateValue Failed`);
    }
}

export const getValue = async (key) => {
    try {
        try {
            return JSON.parse(await redis_client.get(key));
        } catch (error) {
            return await redis_client.get(key);
        }
    } catch (error) {
        console.log(error, `\nRedis getValue Failed`);
    }
}

export const ttl = async (key) => {
    try {
        return await redis_client.ttl(key);
    } catch (error) {
        console.log(error, `\nRedis ttl Failed`);
    }
}

export const exists = async (key) => {
    try {
        return await redis_client.exists(key);
    } catch (error) {
        console.log(error, `\nRedis ttl Failed`);
    }
}

export const expire = async ({ key, ttl } = {}) => {
    try {
        return await redis_client.expire(key, ttl);
    } catch (error) {
        console.log(error, `\nRedis expire Failed`);
    }
}

export const deleteKey = async (key) => {
    try {
        if (!key?.length) throw new Error(`Key:${key} not found in Redis`);
        return await redis_client.del(key);
    } catch (error) {
        console.log(error, `\nRedis delete Failed`);
    }
}

export const keys = async (pattern) => {
    try {
        return await redis_client.keys(`${pattern}*`);
    } catch (error) {
        console.log(error, `\nRedis key Failed`);
    }
}
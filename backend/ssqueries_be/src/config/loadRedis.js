import './loadEnv.js';
import {createClient} from "redis";
import {RedisStore} from "connect-redis";

// redis client create
export const redisClient = createClient({
    url: process.env.REDIS_URL
})

redisClient.on('error', (err) => {
    console.error('Redis client error: ', err)
})

// redis client connect
try {
    await redisClient.connect()
    console.log('Redis client connected')
} catch (err) {
    console.error('Failed to connect to Redis: ', err)
    process.exit(1)
}

// redis store create
export const redisStore = new RedisStore({
    client: redisClient,
    prefix: 'session:',
    ttl: 60 * 30
})

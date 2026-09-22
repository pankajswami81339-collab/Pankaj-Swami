import { Redis, RedisOptions } from 'ioredis';

let redisClient: Redis | null = null;
let isRedisConnected = false;

export function getRedisClient(): Redis | null {
  if (redisClient) {
    return redisClient;
  }

  const redisUrl = process.env.REDIS_URL;
  if (!redisUrl) {
    console.info('ℹ️ [Redis] REDIS_URL not configured. Async queues will operate in in-process fallback mode.');
    return null;
  }

  try {
    const options: RedisOptions = {
      maxRetriesPerRequest: null, // Required by BullMQ
      enableReadyCheck: false,
      retryStrategy: (times) => {
        if (times > 3) {
          console.warn('⚠️ [Redis] Reconnection attempts exhausted. Using in-process queue fallback.');
          return null;
        }
        return Math.min(times * 500, 2000);
      },
    };

    redisClient = new Redis(redisUrl, options);

    redisClient.on('connect', () => {
      isRedisConnected = true;
      console.log('⚡ [Redis] Connected successfully for native automation queue & BullMQ workers');
    });

    redisClient.on('error', (err) => {
      isRedisConnected = false;
      console.warn('⚠️ [Redis] Connection warning (using in-process queue handler):', err.message);
    });

    return redisClient;
  } catch (error) {
    console.warn('⚠️ [Redis] Could not create Redis client:', error);
    return null;
  }
}

export function getRedisStatus() {
  return {
    configured: Boolean(process.env.REDIS_URL),
    connected: isRedisConnected,
  };
}

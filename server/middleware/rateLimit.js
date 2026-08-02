import redis from '../config/redis.js';

const rateLimitConfig = {
  global: { limit: 100, window: 60 }, // 100 requests per minute
  login: { limit: 5, window: 900 }, // 5 requests per 15 minutes
  register: { limit: 3, window: 3600 }, // 3 requests per hour
  checkout: { limit: 10, window: 3600 }, // 10 requests per hour
  review: { limit: 3, window: 86400 }, // 3 requests per day
  contact: { limit: 3, window: 3600 }, // 3 requests per hour
};

export const rateLimit = (type = 'global') => {
  const config = rateLimitConfig[type] || rateLimitConfig.global;
  
  return async (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const key = `ratelimit:${type}:${ip}`;
    
    try {
      const current = await redis.incr(key);
      
      if (current === 1) {
        await redis.expire(key, config.window);
      }
      
      if (current > config.limit) {
        return res.status(429).json({
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'Too many requests, please try again later',
          },
        });
      }
      
      res.setHeader('X-RateLimit-Limit', config.limit);
      res.setHeader('X-RateLimit-Remaining', Math.max(0, config.limit - current));
      res.setHeader('X-RateLimit-Reset', await redis.ttl(key));
      
      next();
    } catch (error) {
      // Redis error, allow request to proceed
      console.error('Rate limit error:', error);
      next();
    }
  };
};

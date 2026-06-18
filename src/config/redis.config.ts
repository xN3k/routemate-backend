import { ConfigService } from '@nestjs/config';
import { RedisOptions } from 'ioredis';

export const getRedisConfig = (config: ConfigService) => ({
    host: config.get<string>('redis.host'),
    port: config.get<number>('redis.port'),
});
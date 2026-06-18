import * as Joi from 'joi';

export const configuration = () => ({
    nodeEnv: process.env.NODE_ENV || 'development',
    port: (process.env.PORT, 10) || 3000,
    appUrl: process.env.APP_URL || 'http://localhost:3000',
    database: {
        host: process.env.DB_HOST,
        ports: (process.env.DB_PORT, 10) || 5432,
        user: process.env.DB_PASSWORD,
        name: process.env.DATABASE_NAME,
        url: process.env.DATABASE_URL,
    },
    redis: {
        host: process.env.REDIS_HOST,
        port: (process.env.REDIS_PORT, 10) || 6379,
        url: process.env.REDIS_URL,
    },
    jwt: {
        accessSecret: process.env.JWT_ACCESS_SECRET,
        accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
        refreshSecret: process.env.JWT_REFRESH_SECRET,
        refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    },
    microservice: {
        port: (process.env.MICROSERVICE_PORT, 10) || 4000,
    },
});

export const validationSchema = Joi.object({
    NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
    PORT: Joi.number().default(3000),
    APP_URL: Joi.string().uri().default('http://localhost:3000'),
    DB_HOST: Joi.string().required(),
    DB_PORT: Joi.number().default(5432),
    DB_USER: Joi.string().required(),
    DB_PASSWORD: Joi.string().required(),
    DB_NAME: Joi.string().required(),
    DATABASE_URL: Joi.string().uri().required(),
    REDIS_HOST: Joi.string().required(),
    REDIS_PORT: Joi.number().default(6379),
    REDIS_URL: Joi.string().required(),
    JWT_ACCESS_SECRET: Joi.string().min(16).required(),
    JWT_ACCESS_EXPIRES_IN: Joi.string().default('15m'),
    JWT_REFRESH_SECRET: Joi.string().min(16).required(),
    JWT_REFRESH_EXPIRES_IN: Joi.string().default('7d'),
    MICROSERVICE_PORT: Joi.number().default(4000),
});
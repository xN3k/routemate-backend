import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const config = app.get(ConfigService);

  app.setGlobalPrefix("api/v1");

  app.enableCors(
    {
      origin: config.get<string>('APP_URL'),
      credentials: true,
    }
  );

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  app.use(cookieParser());

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.REDIS,
    options: {
      host: config.get<string>('redis.host'),
      port: config.get<number>('redis.port'),
    },
  });

  const swaggerConfig = new DocumentBuilder().setTitle('RouteMate API').setDescription("Logistics/ride-hailing backend").setVersion("1.0").addBearerAuth().build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  await app.startAllMicroservices();
  const port = config.get<number>('port') || 3000;
  await app.listen(port);

  Logger.log(`🚀 HTTP ready on http://localhost:${port}/api/v1`, 'Bootstrap');
  Logger.log(`📚 Swagger at http://localhost:${port}/docs`, 'Bootstrap');
  Logger.log(`🚌 Redis microservice attached`, 'Bootstrap');
}
bootstrap();

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';
import { configuration, validationSchema } from './config/configuration';
import { UsersModule } from './modules/users/users.module';
import { DriverModule } from './modules/driver/driver.module';
import { OrdersModule } from './modules/orders/orders.module';
import { TrackingGateway } from './modules/tracking/tracking.gateway';
import { TrackingModule } from './modules/tracking/tracking.module';
import { DispatchModule } from './modules/dispatch/dispatch.module';
import { ChatGateway } from './modules/chat/chat.gateway';
import { ChatService } from './modules/chat/chat.service';
import { ChatModule } from './modules/chat/chat.module';
import { EarningsModule } from './modules/earnings/earnings.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema,
      validationOptions: { abortEarly: true },
    }),
    ClientsModule.registerAsync([{
      name: 'DISPATCH_SERVICE',
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        transport: Transport.REDIS,
        options: {
          host: config.get<string>('redis.host'),
          port: Number(config.get<string>('redis.port')),
        },
      }),
    },]),
    PrismaModule,
    AuthModule,
    UsersModule,
    DriverModule,
    OrdersModule,
    TrackingModule,
    DispatchModule,
    ChatModule,
    EarningsModule],
  controllers: [AppController],
  providers: [AppService,
  { provide: APP_FILTER, useClass: HttpExceptionFilter },
  { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
  { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
  {
    provide: APP_PIPE,
    useValue: new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  },],
})
export class AppModule { }

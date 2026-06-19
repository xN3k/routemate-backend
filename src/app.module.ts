import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
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


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    DriverModule,
    OrdersModule,
    TrackingModule,
    DispatchModule,
    ChatModule],
  controllers: [AppController],
  providers: [AppService, TrackingGateway, ChatGateway, ChatService],
})
export class AppModule { }

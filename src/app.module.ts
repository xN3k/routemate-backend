import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';
import { configuration, validationSchema } from './config/configuration';
import { UsersModule } from './modules/users/users.module';
import { DriverModule } from './driver/driver.module';


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
    DriverModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

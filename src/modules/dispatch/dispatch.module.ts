import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { DispatchService } from './dispatch.service';
import { DispatchController } from './dispatch.controller';
import { OrdersModule } from '../orders/orders.module';

@Module({
    imports: [
        OrdersModule,
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
        }]),
    ],
    providers: [DispatchService],
    controllers: [DispatchController]

})
export class DispatchModule { }

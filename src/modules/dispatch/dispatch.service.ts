import { Injectable, Inject } from '@nestjs/common';
import { ClientRedis } from '@nestjs/microservices';
import { OrdersService } from '../orders/orders.service';


@Injectable()
export class DispatchService {
    constructor(
        @Inject("DISPATCH_SERVICE") private client: ClientRedis,
        private orders: OrdersService,
    ) { }

    async dispatchOrder(orderId: string) {
        const order = await this.orders.findOne(orderId);
        return { status: 'dispatching', orderId };
    }

    async handleDriverMatch(data: { orderId: string, driverId: string }) {
        return this.orders.updateStatus(data.orderId, { status: "ACCEPTED", driverId: data.driverId });
    }

}

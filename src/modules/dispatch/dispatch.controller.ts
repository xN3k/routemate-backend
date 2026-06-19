import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import { DispatchService } from './dispatch.service';
import { JwtAuthGuard } from 'src/common/guards/jwt.auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('dispatch')
export class DispatchController {
    constructor(private readonly dispatchService: DispatchService) { }

    @Get(':orderId')
    dispatch(@Param('orderId') orderId: string) {
        return this.dispatchService.dispatchOrder(orderId);
    }

    @EventPattern('order.dispatch')
    onOrderDispatch(payload: { orderId: string; pickup: { lat: number, lng: number } }) {
        console.log('Received dispatch event:', payload);
        // todo implement driver-matching logic here, then emit 'driver.matched
    }

    @EventPattern('driver.match')
    onDriverMatch(payload: { orderId: string, driverId: string }) {
        return this.dispatchService.handleDriverMatch(payload);
    }

}

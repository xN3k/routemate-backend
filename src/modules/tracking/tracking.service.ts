import { Injectable } from "@nestjs/common";
import { TrackingGateway } from "./tracking.gateway";

@Injectable()
export class TrackingService {
    constructor(private gateway: TrackingGateway) { }

    broadcastLocation(orderId: String, lat: number, lng: number) {
        this.gateway.server.to('order: ${orderId}').emit('locationUpdate', { orderId, lat, lng });

    }
}
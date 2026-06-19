import { Module } from '@nestjs/common';
import { TrackingGateway } from './tracking.gateway';
import { TrackingService } from './tracking.service';

@Module({
    providers: [TrackingGateway, TrackingService],
    imports: [TrackingService],
    exports: [TrackingService],
})
export class TrackingModule {


}

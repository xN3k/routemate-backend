import { OrderStatus } from "@prisma/client";
import { IsEnum, IsNumber, IsString } from "class-validator";

export class CreateOrderDto {
    @IsString()
    userId!: string;

    @IsNumber()
    pickupLat!: number;

    @IsNumber()
    pickupLng!: number;

    @IsNumber()
    dropLat!: number;

    @IsNumber()
    dropLng!: number;

    @IsNumber()
    fare!: number;
}

export class UpdateOrderStatusDto {
    @IsEnum(OrderStatus)
    status!: OrderStatus;

    @IsString()
    driverId!: string;
}

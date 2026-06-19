import { IsNumber, IsString } from "class-validator";

export class CreateEarningDto {
    @IsString()
    driverId!: string;

    @IsString()
    orderId!: string;

    @IsNumber()
    amount!: number;

}

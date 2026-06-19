import { IsNumber } from "class-validator";

export class UpdateLocationDto {
    @IsNumber()
    lat?: number;
    lng?: number;
}
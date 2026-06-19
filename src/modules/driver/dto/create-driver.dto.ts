import { IsBoolean, IsNumber, IsString } from "class-validator"

export class CreateDriverDto {
    @IsString()
    userId!: string;

    @IsString()
    licenseNo!: string;

    @IsString()
    vehiclePlate!: string;

    @IsBoolean()
    isOnline?: boolean;

    @IsNumber()
    locationLat?: number;

    @IsNumber()
    locationLng?: number;

}

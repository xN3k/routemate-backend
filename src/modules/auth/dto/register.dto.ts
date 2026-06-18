import { IsEmail, IsEnum, IsString, MinLength } from "class-validator";
import { Role } from "@prisma/client";

export class RegisterDto {
    @IsEmail()
    email!: string;

    @IsString()
    @MinLength(8)
    password!: string

    @IsString()
    name!: string;

    @IsString()
    phone!: string;

    @IsEnum(Role)
    role!: Role;

}
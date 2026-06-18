import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from "bcrypt";
import { PrismaService } from 'prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { access } from 'fs';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService,
    ) { }

    async register(dto: RegisterDto) {
        const exists = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (exists) throw new ConflictException('Email already in use');

        const hashed = await bcrypt.hash(dto.password, 10);
        const user = await this.prisma.user.create({
            data: { ...dto, password: hashed },
        });
        return this.issueTokens(user.id, user.email, user.role);
    }


    async login(dto: LoginDto) {
        const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (!user || !(await bcrypt.compare(dto.password, user.password))) {
            throw new UnauthorizedException('Invalid Credentials');
        }
        return this.issueTokens(user.id, user.email, user.role);
    }

    private async issueTokens(sub: string, email: string, role: string) {
        const payload = { sub, email, role };
        const accessToken = await this.jwt.signAsync(payload);
        return { accessToken, user: { id: sub, email, role } };
    }
}

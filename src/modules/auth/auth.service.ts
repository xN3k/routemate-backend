import { Injectable, ConflictException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { PrismaService } from 'prisma/prisma.service';


@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService, private config: ConfigService,
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

    decodeToken(token: string): { sub: string; email: string; role: string } {
        try {
            return this.jwt.verify(token, {
                secret: this.config.get<string>('jwt.refreshSecret'),
            });
        } catch {
            throw new UnauthorizedException('Invalid or expired refresh token');
        }
    }

    async refreshToken(userId: string, incomingToken: string) {
        const hashedIncomingToken = crypto.createHash('sha256').update(incomingToken).digest('hex');
        const storedToken = await this.prisma.refreshToken.findFirst({
            where: { token: hashedIncomingToken, userId, revoked: false }
        });

        if (!storedToken) throw new UnauthorizedException("Invalid Refresh Token");
        if (storedToken.expiresAt < new Date()) {
            await this.prisma.refreshToken.delete({ where: { id: storedToken.id } });
            throw new UnauthorizedException("Refresh token expired");
        }
        await this.prisma.refreshToken.delete({ where: { id: storedToken.id } });

        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new NotFoundException('User not found');
        return this.issueTokens(user.id, user.email, user.role);
    }

    async logout(userId: string, incomingToken: string) {
        const hashedIncomingToken = crypto.createHash('sha256').update(incomingToken).digest('hex');

        await this.prisma.refreshToken.deleteMany({
            where: {
                token: hashedIncomingToken, userId,
            }
        }).catch(() => { });
    }

    private async issueTokens(sub: string, email: string, role: string) {
        const payload = { sub, email, role };
        const accessToken = await this.jwt.signAsync(payload, {
            secret: this.config.get<string>('jwt.accessSecret'),
            expiresIn: this.config.get<string>('jwt.accessExpiresIn'),
        } as JwtSignOptions);

        const refreshToken = await this.jwt.signAsync(payload, {
            secret: this.config.get<string>('jwt.refreshSecret'),
            expiresIn: this.config.get<string>('jwt.refreshExpiresIn'),
        } as JwtSignOptions);

        const hashedRefreshToken = crypto.createHash('sha256').update(refreshToken).digest('hex');

        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

        await this.prisma.refreshToken.create({
            data: {
                token: hashedRefreshToken,
                userId: sub,
                expiresAt,
            },
        });

        return { accessToken, refreshToken, user: { id: sub, email, role } };
    }
}

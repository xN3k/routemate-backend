import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ChatService {
    constructor(private prisma: PrismaService) { }

    save(payload: { senderId: string; roomId: string; content: string }) {
        return this.prisma.message.create({ data: payload });
    }

    findByRoom(roomId: string) {
        return this.prisma.message.findMany({ where: { roomId }, orderBy: { createdAt: 'asc' }, include: { sender: { select: { id: true, name: true, } } } });
    }


}

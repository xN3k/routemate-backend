import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEarningDto } from './dto/create-earning.dto';
import { UpdateEarningDto } from './dto/update-earning.dto';
import { PrismaService } from 'prisma/prisma.service';
import { NotFoundError } from 'rxjs';

@Injectable()
export class EarningsService {
  constructor(private prisma: PrismaService) { }

  create(createEarningDto: CreateEarningDto) {
    return this.prisma.earning.create({ data: createEarningDto });
  }

  findByDriver(driverId: string) {
    return this.prisma.earning.findMany({ where: { driverId }, include: { order: true } });
  }

  async getDriverTotal(driverId: string) {
    const agg = await this.prisma.earning.aggregate({ where: { driverId }, _sum: { amount: true } });
    return { driverId, total: agg._sum.amount ?? 0 };
  }

  findOne(id: string) {
    const earning = this.prisma.earning.findUnique({ where: { id } });
    if (!earning) throw new NotFoundException("Earning record not found");
    return earning;
  }
}

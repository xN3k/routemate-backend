import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) { }

  create(createOrderDto: CreateOrderDto) {
    return this.prisma.order.create({ data: createOrderDto });
  }

  findAll() {
    return this.prisma.order.findMany({ include: { user: true, driver: true } });
  }

  async findOne(id: string) {
    const order = this.prisma.order.findUnique({ where: { id }, include: { user: true, driver: true, } });
    if (!order) throw new NotFoundException("Order not found");
    return order;
  }

  async updateStatus(id: string, updateOrderStatusDto: UpdateOrderStatusDto) {
    const { driverId } = updateOrderStatusDto;
    if (driverId) {
      const driver = await this.prisma.driver.findUnique({ where: { id: driverId } });
      if (!driver) throw new NotFoundException('Driver not found');
    }
    return this.prisma.order.update({ where: { id }, data: updateOrderStatusDto });
  }

  findByUser(userId: string) {
    return this.prisma.order.findMany({ where: { userId }, include: { driver: true } });
  }

  findByDriver(driverId: string) {
    return this.prisma.order.findMany({ where: { driverId }, include: { user: true } })
  }

  remove(id: string) {
    return this.prisma.order.delete({ where: { id } });
  }
}

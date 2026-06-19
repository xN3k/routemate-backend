import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { PrismaService } from 'prisma/prisma.service';
import { UpdateLocationDto } from './dto/update-location.dto';

@Injectable()
export class DriverService {
  constructor(private prisma: PrismaService) { }


  create(createDriverDto: CreateDriverDto) {
    return this.prisma.driver.create({ data: createDriverDto });
  }

  findAll() {
    return this.prisma.driver.findMany({ include: { user: { select: { id: true, name: true, email: true } } } });
  }

  async findOne(id: string) {
    const driver = await this.prisma.driver.findUnique({ where: { id } });
    if (!driver) throw new NotFoundException('Driver not found');
    return driver;
  }

  updateLocation(id: string, updateLocationDto: UpdateLocationDto) {
    return this.prisma.driver.update({ where: { id }, data: { locationLat: updateLocationDto.lat, locationLng: updateLocationDto.lng, isOnline: true } });
  }

  setOnlineStatus(id: string, isOnline: boolean) {
    return this.prisma.driver.update({ where: { id }, data: { isOnline } });
  }

  findNearby(lat: number, lng: number, radiusKm = 5) {
    return this.prisma.$queryRaw`
      SELECT *, (
        6371 * acos(cos(radians(${lat})) * cos(radians("locationLat")) *
        cos(radians("locationLng") - radians(${lng})) +
        sin(radians(${lat})) * sin(radians("locationLat")))
      ) AS distance
      FROM "Driver"
      WHERE "isOnline" = true
      HAVING distance < ${radiusKm}
      ORDER BY distance;
    `;
  }


  // remove(id: number) {
  //   return `This action removes a #${id} driver`;
  // }
}

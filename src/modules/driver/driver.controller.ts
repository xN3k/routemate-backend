import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { DriverService } from './driver.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { UpdateLocationDto } from './dto/update-location.dto';

@Controller('driver')
export class DriverController {
  constructor(private readonly driverService: DriverService) { }

  @Post()
  create(@Body() createDriverDto: CreateDriverDto) {
    return this.driverService.create(createDriverDto);
  }

  @Get()
  findAll() {
    return this.driverService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.driverService.findOne(id);
  }

  @Get('nearby')
  findNearby(@Query('lat') lat: string, @Query('lng') lng: string, @Query('radius') radius?: string) {
    return this.driverService.findNearby(parseFloat(lat), parseFloat(lng), radius ? parseFloat(radius) : undefined);
  }
  @Patch(':id/location')
  updateLocation(@Param('id') id: string, @Body() dto: UpdateLocationDto) {
    return this.driverService.updateLocation(id, dto);
  }

  @Patch(':id/status')
  setOnline(@Param('id') id: string, @Body('isOnline') isOnline: boolean) {
    return this.driverService.setOnlineStatus(id, isOnline);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateDriverDto: UpdateDriverDto) {
  //   return this.driverService.update(id, updateDriverDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.driverService.remove(+id);
  // }
}

import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EarningsService } from './earnings.service';
import { CreateEarningDto } from './dto/create-earning.dto';
import { UpdateEarningDto } from './dto/update-earning.dto';

@Controller('earnings')
export class EarningsController {
  constructor(private readonly earningsService: EarningsService) { }

  @Post()
  create(@Body() createEarningDto: CreateEarningDto) {
    return this.earningsService.create(createEarningDto);
  }

  @Get('driver/:driverId')
  findAll(@Param('driverId') driverId: string) {
    return this.earningsService.findByDriver(driverId);
  }

  @Get('driver/driverId/total')
  total(@Param('driverId') driverId: string) {
    return this.earningsService.getDriverTotal(driverId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.earningsService.findOne(id);
  }


}

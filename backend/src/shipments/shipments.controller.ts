import {
  Controller,
  Get,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ShipmentsService } from './shipments.service';
import { UpdateShipmentDto } from './dto/shipment.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '../schemas/user.schema';

@Controller('shipments')
@UseGuards(JwtAuthGuard)
export class ShipmentsController {
  constructor(private readonly shipmentsService: ShipmentsService) {}

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.shipmentsService.findById(id);
  }

  // Routes CLIENT
  @UseGuards(JwtAuthGuard)
  @Get('customer/my-shipments')
  async getMyShipments(@CurrentUser() user: any) {
    return this.shipmentsService.findByCustomerId(user.userId);
  }

  // Routes SELLER
  @Get('seller/shipments')
  @UseGuards(RolesGuard)
  @Roles(UserRole.SELLER)
  async getSellerShipments(@CurrentUser() user: any) {
    return this.shipmentsService.findBySellerId(user.userId);
  }

  @Put('seller/:id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.SELLER)
  async updateShipment(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() updateDto: UpdateShipmentDto,
  ) {
    return this.shipmentsService.update(id, user.userId, updateDto);
  }

  // Routes ADMIN
  @Get('admin/all')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async getAllShipments(@Query() filters: { status?: string; sellerId?: string }) {
    return this.shipmentsService.findAll(filters);
  }
}

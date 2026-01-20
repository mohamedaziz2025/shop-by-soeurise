import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ShopsService } from './shops.service';
import { CreateShopDto, UpdateShopDto } from './dto/shop.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '../schemas/user.schema';

@Controller('shops')
export class ShopsController {
  constructor(private readonly shopsService: ShopsService) {}

  // Routes publiques
  @Get()
  async findAll(
    @Query()
    filters: {
      status?: string;
      category?: string;
      isFeatured?: boolean;
    },
  ) {
    return this.shopsService.findAll(filters);
  }

  @Get('slug/:slug')
  async findBySlug(@Param('slug') slug: string) {
    return this.shopsService.findBySlug(slug);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.shopsService.findById(id);
  }

  // Routes SELLER
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SELLER, UserRole.CLIENT)
  async create(@CurrentUser() user: any, @Body() createShopDto: CreateShopDto) {
    return this.shopsService.create(user.userId, createShopDto);
  }

  @Get('seller/my-shop')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SELLER)
  async getMyShop(@CurrentUser() user: any) {
    return this.shopsService.findBySellerId(user.userId);
  }

  @Get('seller/stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SELLER)
  async getSellerStats(@CurrentUser() user: any) {
    return this.shopsService.getSellerStats(user.userId);
  }

  @Put('seller/my-shop')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SELLER)
  async update(@CurrentUser() user: any, @Body() updateShopDto: UpdateShopDto) {
    return this.shopsService.update(user.userId, updateShopDto);
  }

  @Delete('seller/my-shop')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SELLER)
  async delete(@CurrentUser() user: any) {
    return this.shopsService.delete(user.userId);
  }

  // Routes ADMIN
  @Put(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.shopsService.updateStatus(id, status);
  }

  @Put(':id/featured')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async toggleFeatured(@Param('id') id: string) {
    return this.shopsService.toggleFeatured(id);
  }

  @Put(':id/compliance')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async setCompliance(
    @Param('id') id: string,
    @Body() body: { isCompliant: boolean; reason?: string },
  ) {
    return this.shopsService.setCompliance(id, body.isCompliant, body.reason);
  }
}

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
import { UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import * as fs from 'fs';

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

  @Get('partners')
  async listPartners() {
    return this.shopsService.getPartners();
  }

  // Routes SELLER
  @Get('seller/my-shop')
  async getMyShop(@CurrentUser() user: any) {
    return this.shopsService.findBySellerId(user.userId);
  }

  @Get('seller/stats')
  async getSellerStats(@CurrentUser() user: any) {
    return this.shopsService.getSellerStats(user.userId);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.shopsService.findById(id);
  }

  @Post()
  async create(@CurrentUser() user: any, @Body() createShopDto: CreateShopDto) {
    return this.shopsService.create(user.userId, createShopDto);
  }

  @Put('seller/my-shop')
  async update(@CurrentUser() user: any, @Body() updateShopDto: UpdateShopDto) {
    return this.shopsService.update(user.userId, updateShopDto);
  }

  @Post('seller/logo')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const dir = join(process.cwd(), 'uploads', 'logos');
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
          }
          cb(null, dir);
        },
        filename: (req, file, cb) => {
          const name = file.originalname
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9\-\.]/g, '');
          const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          cb(null, `${unique}${extname(name)}`);
        },
      }),
      limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
    })
  )
  async uploadLogo(@CurrentUser() user: any, @UploadedFile() file: Express.Multer.File) {
    const publicUrl = `/uploads/logos/${file.filename}`;
    return this.shopsService.update(user.userId, { logo: publicUrl } as UpdateShopDto);
  }

  @Delete('seller/my-shop')
  async delete(@CurrentUser() user: any) {
    return this.shopsService.delete(user.userId);
  }

  // Routes ADMIN
  @Put(':id/status')
  async updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.shopsService.updateStatus(id, status);
  }

  @Put(':id/featured')
  async toggleFeatured(@Param('id') id: string) {
    return this.shopsService.toggleFeatured(id);
  }

  @Put(':id/compliance')
  async setCompliance(
    @Param('id') id: string,
    @Body() body: { isCompliant: boolean; reason?: string },
  ) {
    return this.shopsService.setCompliance(id, body.isCompliant, body.reason);
  }
}

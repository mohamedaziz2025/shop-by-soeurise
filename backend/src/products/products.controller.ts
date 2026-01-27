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
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import {
  CreateProductDto,
  UpdateProductDto,
  CreateVariantDto,
  UpdateVariantDto,
} from './dto/product.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '../schemas/user.schema';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import * as fs from 'fs';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // Routes publiques
  @Get()
  async findAll(
    @Query()
    filters: {
      shopId?: string;
      category?: string;
      status?: string;
      search?: string;
      minPrice?: number;
      maxPrice?: number;
      tags?: string[];
      isFeatured?: boolean;
    },
  ) {
    return this.productsService.findAll(filters);
  }

  @Get('slug/:slug')
  async findBySlug(@Param('slug') slug: string) {
    return this.productsService.findBySlug(slug);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.productsService.findById(id);
  }

  // Routes SELLER
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SELLER)
  @UseInterceptors(
    FilesInterceptor('images', 8, {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const dir = join(process.cwd(), 'uploads', 'products');
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
          }
          cb(null, dir);
        },
        filename: (req, file, cb) => {
          const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${unique}${ext}`);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 },
    })
  )
  async create(
    @CurrentUser() user: any,
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() images?: Express.Multer.File[],
  ) {
    if (images && images.length > 0) {
      createProductDto.images = images.map((f) => `/uploads/products/${f.filename}`);
      if (images.length > 0) {
        createProductDto.image = `/uploads/products/${images[0].filename}`;
      }
    }
    return this.productsService.create(user.userId, createProductDto);
  }

  @Get('seller/my-products')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SELLER)
  async getMyProducts(@CurrentUser() user: any) {
    return this.productsService.findBySellerId(user.userId);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SELLER)
  async update(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, user.userId, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SELLER)
  async delete(@Param('id') id: string, @CurrentUser() user: any) {
    return this.productsService.delete(id, user.userId);
  }

  // Routes VARIANTES
  @Post(':id/variants')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SELLER)
  async createVariant(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() createVariantDto: CreateVariantDto,
  ) {
    return this.productsService.createVariant(id, user.userId, createVariantDto);
  }

  @Get(':id/variants')
  async getVariants(@Param('id') id: string) {
    return this.productsService.findVariantsByProductId(id);
  }

  @Put('variants/:variantId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SELLER)
  async updateVariant(
    @Param('variantId') variantId: string,
    @CurrentUser() user: any,
    @Body() updateVariantDto: UpdateVariantDto,
  ) {
    return this.productsService.updateVariant(
      variantId,
      user.userId,
      updateVariantDto,
    );
  }

  @Delete('variants/:variantId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SELLER)
  async deleteVariant(
    @Param('variantId') variantId: string,
    @CurrentUser() user: any,
  ) {
    return this.productsService.deleteVariant(variantId, user.userId);
  }

  // Routes ADMIN
  @Put(':id/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async approveProduct(
    @Param('id') id: string,
    @Body() body: { isApproved: boolean; note?: string },
  ) {
    return this.productsService.approveProduct(id, body.isApproved, body.note);
  }

  @Put(':id/featured')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async toggleFeatured(@Param('id') id: string) {
    return this.productsService.toggleFeatured(id);
  }
}

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto, ChangePasswordDto } from './dto/update-user.dto';
import { BecomeSellerDto } from './dto/become-seller.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '../schemas/user.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import * as fs from 'fs';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  async getProfile(@CurrentUser() user: any) {
    return this.usersService.findById(user.userId);
  }

  @Get('favorites')
  async getFavorites(@CurrentUser() user: any) {
    return this.usersService.getFavorites(user.userId);
  }

  @Put('favorites/:productId')
  async addToFavorites(
    @CurrentUser() user: any,
    @Param('productId') productId: string,
  ) {
    return this.usersService.addToFavorites(user.userId, productId);
  }

  @Delete('favorites/:productId')
  async removeFromFavorites(
    @CurrentUser() user: any,
    @Param('productId') productId: string,
  ) {
    return this.usersService.removeFromFavorites(user.userId, productId);
  }

  @Put('profile')
  async updateProfile(
    @CurrentUser() user: any,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateProfile(user.userId, updateUserDto);
  }

  @Put('change-password')
  async changePassword(
    @CurrentUser() user: any,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.usersService.changePassword(user.userId, changePasswordDto);
  }

  @Post('become-seller')
  async becomeSeller(
    @CurrentUser() user: any,
    @Body() becomeSellerDto: BecomeSellerDto,
  ) {
    return this.usersService.becomeSeller(user.userId, becomeSellerDto);
  }

  @Post('seller-profile/logo')
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
  async uploadSellerProfileLogo(
    @CurrentUser() user: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const publicUrl = `/uploads/logos/${file.filename}`;
    return this.usersService.updateSellerProfileLogo(user.userId, publicUrl);
  }

  @Delete('account')
  async deleteAccount(@CurrentUser() user: any) {
    return this.usersService.deleteAccount(user.userId);
  }

  // Routes ADMIN
  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async findAll(@Query() filters: { role?: string; status?: string }) {
    return this.usersService.findAll(filters);
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async findById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Put(':id/status')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.usersService.updateStatus(id, status);
  }
}

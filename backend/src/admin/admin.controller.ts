import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../schemas/user.schema';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard/stats')
  async getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  @Get('sales/stats')
  async getSalesStats(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.adminService.getSalesStats(
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Get('shops/top')
  async getTopShops(@Query('limit') limit?: number) {
    return this.adminService.getTopShops(limit ? parseInt(limit.toString()) : 10);
  }

  @Get('products/top')
  async getTopProducts(@Query('limit') limit?: number) {
    return this.adminService.getTopProducts(limit ? parseInt(limit.toString()) : 10);
  }

  @Get('shops/pending')
  async getPendingShops() {
    return this.adminService.getPendingShops();
  }

  @Get('products/pending')
  async getPendingProducts() {
    return this.adminService.getPendingProducts();
  }

  @Get('users/recent')
  async getRecentUsers(@Query('limit') limit?: number) {
    return this.adminService.getRecentUsers(limit ? parseInt(limit.toString()) : 20);
  }

  @Get('orders/recent')
  async getRecentOrders(@Query('limit') limit?: number) {
    return this.adminService.getRecentOrders(limit ? parseInt(limit.toString()) : 20);
  }

  @Get('commissions/report')
  async getCommissionsReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.adminService.getCommissionsReport(
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Get('sales/daily')
  async getDailySales(
    @Query('days') days?: number,
  ) {
    return this.adminService.getDailySales(days ? parseInt(days.toString()) : 7);
  }

  @Get('categories/stats')
  async getCategoriesStats() {
    return this.adminService.getCategoriesStats();
  }

  @Get('users')
  async getAllUsers(@Query() filters: any) {
    return this.adminService.getAllUsers(filters);
  }

  @Get('shops')
  async getAllShops() {
    return this.adminService.getAllShops();
  }
}

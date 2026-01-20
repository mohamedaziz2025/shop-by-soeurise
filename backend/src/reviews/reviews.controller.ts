import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto, RespondToReviewDto } from './dto/review.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '../schemas/user.schema';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  // Routes publiques
  @Get('product/:productId')
  async getProductReviews(
    @Param('productId') productId: string,
    @Query() filters: { status?: string },
  ) {
    return this.reviewsService.findByProductId(productId, filters);
  }

  @Get('shop/:shopId')
  async getShopReviews(@Param('shopId') shopId: string) {
    return this.reviewsService.findByShopId(shopId);
  }

  // Routes CLIENT
  @Post()
  @UseGuards(JwtAuthGuard)
  async createReview(
    @CurrentUser() user: any,
    @Body() createReviewDto: CreateReviewDto,
  ) {
    return this.reviewsService.create(user.userId, createReviewDto);
  }

  // Routes SELLER
  @Put(':id/respond')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SELLER)
  async respondToReview(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() respondDto: RespondToReviewDto,
  ) {
    return this.reviewsService.respondToReview(id, user.userId, respondDto);
  }

  // Routes ADMIN
  @Get('admin/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async getAllReviews(@Query() filters: { status?: string; shopId?: string }) {
    return this.reviewsService.findAll(filters);
  }

  @Put('admin/:id/moderate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async moderateReview(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() body: { status: string; reason?: string },
  ) {
    return this.reviewsService.moderateReview(
      id,
      user.userId,
      body.status,
      body.reason,
    );
  }
}
